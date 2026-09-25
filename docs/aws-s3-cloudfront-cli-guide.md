# Deploying this portfolio to AWS S3 + CloudFront (CLI)

**Learning material.** This project’s production host is **Vercel** (`docs/vercel-deployment-guide.md`).  
This guide explains an equivalent static hosting path on **Amazon S3 + CloudFront**, driven entirely from the CLI, so you understand what a CDN + object store deploy looks like when you already ship a static `out/` folder.

You do **not** need to migrate. Treat this as a lab exercise.

---

## Why this project fits S3 + CloudFront

| Project fact | Implication on AWS |
|---|---|
| `next.config.ts` → `output: "export"` | Build produces a static site in `out/` — no Node server |
| `trailingSlash: true` | URLs like `/ja/` map to `out/ja/index.html` |
| No `app/api`, no middleware | Nothing that S3/CloudFront cannot serve |
| `images: { unoptimized: true }` | Image files are plain assets in `out/` |
| `vercel.json` redirects `/` → `/ja/` | Must be reproduced with CloudFront (or keep `out/index.html` meta-refresh) |
| PDF download headers | Must be set via S3 metadata and/or CloudFront response headers |

Architecture after deploy:

```text
Browser
  │  HTTPS
  ▼
CloudFront (CDN, TLS, optional custom domain)
  │  Origin Access Control (OAC)
  ▼
S3 bucket (private)  ←──  aws s3 sync ./out  s3://bucket/
```

CloudFront is the public face. The bucket stays private so people cannot bypass the CDN and list your objects.

---

## What you will build

1. A private S3 bucket holding the contents of `out/`
2. A CloudFront distribution in front of that bucket
3. CLI sync + cache invalidation workflow for updates
4. Optional: custom domain + ACM certificate
5. Optional: PDF `Content-Disposition: attachment` (same intent as `vercel.json`)

---

## Prerequisites

### Tools

- Node.js 20+ (to build this repo)
- [AWS CLI v2](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
- An AWS account with billing enabled
- `jq` (optional, helpful for parsing JSON)

Verify:

```bash
node -v
aws --version
```

### AWS credentials

Create an IAM user or role with permissions for S3, CloudFront, ACM (if using a custom domain), and IAM (only if you create OAC-related policies yourself). For learning, a temporary admin user in a sandbox account is simplest; for real use, least-privilege is better.

```bash
aws configure
# AWS Access Key ID
# AWS Secret Access Key
# Default region: e.g. ap-northeast-1 (Tokyo)
# Output: json
```

Confirm:

```bash
aws sts get-caller-identity
```

### Build this site first

From the repo root:

```bash
npm ci
npm run check:design
npm run build
```

`npm run build` runs `next build` and then `scripts/write-root-redirect.mjs`, which writes `out/index.html` that meta-refreshes to `/ja/`. That file is useful on S3 even before you add a CloudFront redirect.

Confirm:

```bash
ls out/ja/index.html out/en/index.html out/index.html out/resume-ja.pdf out/career-history-ja.pdf
```

---

## Step 0 — Choose names and region

Pick values and stick to them. Example:

```bash
export AWS_REGION=ap-northeast-1
export ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
export BUCKET="portfolio-sunmyung-$(date +%Y%m%d)"   # must be globally unique
export DIST_COMMENT="dev-portfolio-next static"
```

S3 bucket names are **global**. If create fails with `BucketAlreadyExists`, change the name.

---

## Step 1 — Create a private S3 bucket

```bash
# Create bucket (ap-northeast-1 needs LocationConstraint)
aws s3api create-bucket \
  --bucket "$BUCKET" \
  --region "$AWS_REGION" \
  --create-bucket-configuration LocationConstraint="$AWS_REGION"
```

For `us-east-1` only, omit `--create-bucket-configuration`.

Block all public access (CloudFront will be the only reader):

```bash
aws s3api put-public-access-block \
  --bucket "$BUCKET" \
  --public-access-block-configuration \
    BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
```

Optional: enable versioning while learning (easy rollback):

```bash
aws s3api put-bucket-versioning \
  --bucket "$BUCKET" \
  --versioning-configuration Status=Enabled
```

---

## Step 2 — Upload `out/` to S3

### First sync

```bash
aws s3 sync ./out "s3://$BUCKET/" --delete
```

`--delete` removes remote keys that no longer exist locally. Useful so old hashed `/_next/static/...` chunks do not pile up.

### Smarter cache headers (recommended)

HTML should revalidate often; hashed static assets can be cached for a long time.

```bash
# 1) Almost everything with a long cache (will overwrite HTML next)
aws s3 sync ./out "s3://$BUCKET/" \
  --delete \
  --cache-control "public,max-age=31536000,immutable" \
  --exclude "*.html" \
  --exclude "*.pdf"

# 2) HTML: short cache / must-revalidate
aws s3 sync ./out "s3://$BUCKET/" \
  --exclude "*" \
  --include "*.html" \
  --cache-control "public,max-age=0,must-revalidate" \
  --content-type "text/html; charset=utf-8"

# 3) PDFs: force download (mirrors vercel.json intent)
aws s3 cp ./out/resume-ja.pdf "s3://$BUCKET/resume-ja.pdf" \
  --content-type "application/pdf" \
  --content-disposition 'attachment; filename="Woo_Sunmyung_rireki.pdf"' \
  --cache-control "public,max-age=86400"

aws s3 cp ./out/career-history-ja.pdf "s3://$BUCKET/career-history-ja.pdf" \
  --content-type "application/pdf" \
  --content-disposition 'attachment; filename="Woo_Sunmyung_shokumu.pdf"' \
  --cache-control "public,max-age=86400"
```

S3 object metadata (`Content-Disposition`) is returned to the browser when CloudFront forwards origin headers (default for most setups).

List a few keys:

```bash
aws s3 ls "s3://$BUCKET/" --recursive | head
```

At this point the site is **not** public yet. Opening the S3 website endpoint would fail or be blocked — that is intentional.

---

## Step 3 — Origin Access Control (OAC) + bucket policy

Older tutorials use Origin Access Identity (OAI). Prefer **OAC**.

### Create OAC

```bash
OAC_ID=$(aws cloudfront create-origin-access-control \
  --origin-access-control-config "{
    \"Name\": \"${BUCKET}-oac\",
    \"Description\": \"OAC for portfolio bucket\",
    \"SigningProtocol\": \"sigv3\",
    \"SigningBehavior\": \"always\",
    \"OriginAccessControlOriginType\": \"s3\"
  }" \
  --query 'OriginAccessControl.Id' \
  --output text)

echo "OAC_ID=$OAC_ID"
```

### Create the CloudFront distribution

Save a distribution config. Replace placeholders after export:

```bash
cat > /tmp/cf-dist-config.json <<EOF
{
  "CallerReference": "portfolio-$(date +%s)",
  "Comment": "${DIST_COMMENT}",
  "Enabled": true,
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "s3-${BUCKET}",
        "DomainName": "${BUCKET}.s3.${AWS_REGION}.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        },
        "OriginAccessControlId": "${OAC_ID}"
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "s3-${BUCKET}",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": {
      "Quantity": 2,
      "Items": ["GET", "HEAD"],
      "CachedMethods": { "Quantity": 2, "Items": ["GET", "HEAD"] }
    },
    "Compress": true,
    "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6",
    "OriginRequestPolicyId": "88a5eaf4-2fd4-4709-b370-b4c650ea3fcf"
  },
  "Aliases": { "Quantity": 0 },
  "PriceClass": "PriceClass_200",
  "HttpVersion": "http2and3",
  "ViewerCertificate": {
    "CloudFrontDefaultCertificate": true,
    "MinimumProtocolVersion": "TLSv1.2_2021"
  },
  "CustomErrorResponses": {
    "Quantity": 1,
    "Items": [
      {
        "ErrorCode": 403,
        "ResponseCode": 404,
        "ResponsePagePath": "/404.html",
        "ErrorCachingMinTTL": 60
      }
    ]
  }
}
EOF
```

Notes:

- `CachePolicyId` `658327ea-…` = managed **CachingOptimized**
- `OriginRequestPolicyId` `88a5eaf4-…` = managed **CORS-S3Origin** (safe default; adjust if you tighten later)
- `PriceClass_200` = most regions except the most expensive edge locations (fine for learning)
- Custom error maps S3’s private-bucket `403` to your exported `404.html` when a key is missing

Create the distribution:

```bash
DIST_ID=$(aws cloudfront create-distribution \
  --distribution-config file:///tmp/cf-dist-config.json \
  --query 'Distribution.Id' \
  --output text)

DOMAIN=$(aws cloudfront get-distribution \
  --id "$DIST_ID" \
  --query 'Distribution.DomainName' \
  --output text)

echo "DIST_ID=$DIST_ID"
echo "CloudFront domain: https://$DOMAIN"
```

Distributions take **5–15 minutes** to deploy. Check:

```bash
aws cloudfront get-distribution --id "$DIST_ID" --query 'Distribution.Status'
# "InProgress" → wait → "Deployed"
```

### Allow CloudFront to read the bucket

Attach a bucket policy that grants only this distribution’s service principal + OAC condition:

```bash
cat > /tmp/bucket-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontServicePrincipalRead",
      "Effect": "Allow",
      "Principal": { "Service": "cloudfront.amazonaws.com" },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::${BUCKET}/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::${ACCOUNT_ID}:distribution/${DIST_ID}"
        }
      }
    }
  ]
}
EOF

aws s3api put-bucket-policy \
  --bucket "$BUCKET" \
  --policy file:///tmp/bucket-policy.json
```

---

## Step 4 — Trailing slashes and `/` → `/ja/`

This app uses `trailingSlash: true`, so the canonical pages are `/ja/` and `/en/` (`index.html` inside those folders).

### Root `/`

You already have `out/index.html` with a meta-refresh to `/ja/`. After sync, `https://$DOMAIN/` serves that file via `DefaultRootObject: index.html`. That is enough for learning.

For a **real** HTTP redirect (like `vercel.json`), add a CloudFront Function or Lambda@Edge that returns `302` with `Location: /ja/`. Example CloudFront Function (viewer-request):

```js
function handler(event) {
  var request = event.request;
  if (request.uri === "/") {
    return {
      statusCode: 302,
      statusDescription: "Found",
      headers: {
        location: { value: "/ja/" },
      },
    };
  }
  return request;
}
```

Wire it with `aws cloudfront create-function` + update the distribution’s `DefaultCacheBehavior.FunctionAssociations`. Meta-refresh is simpler for a lab.

### Requests without trailing slash (`/ja` vs `/ja/`)

S3 will not automatically append a slash. Options:

1. Teach users/bookmarks to use `/ja/` (your in-app links already do)
2. Add a CloudFront Function that redirects `/ja` → `/ja/`
3. Duplicate objects (worse)

For learning, (1) + correct internal links is enough. This repo’s language switch uses `/ja/` and `/en/`.

---

## Step 5 — Smoke test

Once `Status` is `Deployed`:

```bash
curl -sI "https://$DOMAIN/" | head
curl -sI "https://$DOMAIN/ja/" | head
curl -sI "https://$DOMAIN/en/" | head
curl -sI "https://$DOMAIN/resume-ja.pdf" | rg -i 'HTTP|content-disposition|content-type'
curl -s "https://$DOMAIN/ja/" | rg -o '<title>[^<]+|id="projects"|VocaloCart' | head
```

Checklist (same spirit as the Vercel guide):

- [ ] `/` shows Japanese portfolio (redirect or meta-refresh)
- [ ] `/ja/` and `/en/` load
- [ ] Language switch works
- [ ] Section anchors work
- [ ] PDFs download with attachment disposition
- [ ] Screenshots load

---

## Step 6 — Updating the site (day-2 workflow)

```bash
npm run build

# sync with cache rules (reuse the three-step sync from Step 2)
aws s3 sync ./out "s3://$BUCKET/" --delete \
  --cache-control "public,max-age=31536000,immutable" \
  --exclude "*.html" --exclude "*.pdf"
# ... then HTML + PDF cp commands from Step 2 ...

# Invalidate CloudFront so edges drop old HTML
aws cloudfront create-invalidation \
  --distribution-id "$DIST_ID" \
  --paths "/*"
```

Invalidating `/*` is blunt but fine for a small portfolio. For larger sites, invalidate `/`, `/ja/*`, `/en/*`, and leave long-cached `/_next/static/*` alone (filenames change when content changes).

Invalidations: first 1,000 path invalidations per month are free (see current AWS pricing).

---

## Step 7 — Optional custom domain

1. Request an ACM certificate in **`us-east-1`** (required for CloudFront), DNS validated against your domain.
2. Add an alternate domain name (CNAME / Alias) on the distribution.
3. Point DNS (Route 53 or external) to the CloudFront domain.

Sketch:

```bash
# Certificate MUST be in us-east-1 for CloudFront
aws acm request-certificate \
  --region us-east-1 \
  --domain-name example.com \
  --subject-alternative-names www.example.com \
  --validation-method DNS
```

Complete DNS validation in the ACM console or CLI, then update the distribution’s `Aliases` and `ViewerCertificate` (ACM ARN, `SSLSupportMethod: sni-only`). This step is the fiddliest part of CLI-only CloudFront; many people finish TLS in the console once, then keep using CLI for `s3 sync` + invalidation.

Also update this repo’s `metadataBase` to the custom HTTPS origin when you go live on AWS (same as the Vercel note).

---

## Mapping Vercel features → AWS

| This repo (Vercel) | S3 + CloudFront equivalent |
|---|---|
| `npm run build` → `out/` | Same build; upload `out/` |
| Platform hosts Next output | You own bucket + distribution |
| `vercel.json` `/` → `/ja/` | Meta-refresh `index.html` and/or CloudFront Function |
| PDF `Content-Disposition` headers | `aws s3 cp --content-disposition ...` (and/or response headers policy) |
| Automatic HTTPS + domain UI | ACM + CloudFront aliases + DNS |
| Git push auto-deploy | DIY: GitHub Actions → `aws s3 sync` + invalidation |
| Preview deployments | Separate bucket/distribution or path prefix (manual) |
| `vercel --prod` | Sync + invalidate |

---

## Minimal GitHub Actions sketch (optional learning)

Not required. Example job after tests:

```yaml
# conceptual — do not enable unless you intentionally leave Vercel
- run: npm ci && npm run build
- run: |
    aws s3 sync ./out s3://${{ secrets.BUCKET }}/ --delete
    aws cloudfront create-invalidation --distribution-id ${{ secrets.DIST_ID }} --paths "/*"
  env:
    AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
    AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    AWS_DEFAULT_REGION: ap-northeast-1
```

Prefer OIDC federation to AWS over long-lived access keys when you do this for real.

---

## Cost awareness (order-of-magnitude)

For a personal portfolio with low traffic:

- S3 storage: cents/month for a few hundred MB
- CloudFront: free tier includes a fair amount of HTTPS data out; beyond that, pay per GB
- Invalidations: free tier for paths/month
- ACM public certs: free

Always check current [AWS pricing](https://aws.amazon.com/cloudfront/pricing/) and set a billing alarm in a sandbox account before experimenting.

---

## Cleanup (avoid surprise bills)

```bash
# Disable + delete distribution (must wait until Deployed after disable)
aws cloudfront get-distribution-config --id "$DIST_ID" > /tmp/dist.json
# set Enabled=false, pass ETag If-Match, then delete-distribution when status allows

aws s3 rm "s3://$BUCKET" --recursive
aws s3api delete-bucket --bucket "$BUCKET" --region "$AWS_REGION"

# delete OAC if unused
aws cloudfront delete-origin-access-control --id "$OAC_ID" --if-match "$(
  aws cloudfront get-origin-access-control --id "$OAC_ID" --query ETag --output text
)"
```

Deleting a distribution is multi-step (disable → wait → delete). The console is acceptable for teardown after a lab.

---

## Common pitfalls

| Symptom | Likely cause |
|---|---|
| `403` on every path | Bucket policy missing / wrong `SourceArn` / OAC not attached |
| `/ja` 404 but `/ja/` works | Trailing-slash; add redirect function or link only with `/` |
| Old HTML after deploy | Forgot CloudFront invalidation; HTML cached at edge |
| PDF opens inline | Missing `Content-Disposition` on the S3 object |
| Mixed content / wrong OG URLs | `metadataBase` still `https://example.com` |
| `next start` on EC2 “because AWS” | Unnecessary for this app — it is static |

---

## How this relates to the current stack

```text
Today (keep):    Git push → Vercel → https://….vercel.app
This guide:      npm run build → aws s3 sync → CloudFront → https://dxxxx.cloudfront.net
```

Same artifact (`out/`). Different edge network, TLS, redirects, and ops surface. Understanding S3 + CloudFront makes Vercel’s “static hosting + CDN” model less magical — and clarifies why `output: "export"` was chosen for this portfolio.

When you are done experimenting, keep shipping on Vercel unless you have a concrete reason to move (compliance, existing AWS org, multi-cloud drills, etc.).

---

## Quick command cheat sheet

```bash
npm run build
aws s3 sync ./out "s3://$BUCKET/" --delete
aws cloudfront create-invalidation --distribution-id "$DIST_ID" --paths "/*"
aws cloudfront get-distribution --id "$DIST_ID" --query 'Distribution.DomainName'
curl -sI "https://$DOMAIN/ja/"
```

| Doc | Purpose |
|---|---|
| `docs/vercel-deployment-guide.md` | Actual production path |
| `docs/portfolio-implementation-plan.md` | What the site is |
| This file | S3 + CloudFront lab from the CLI |
