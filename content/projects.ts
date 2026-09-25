import type { Localized } from "@/lib/i18n";

export type ProjectLayout = "image-first" | "text-first" | "breakdown";

export type BreakdownRow = {
  label: Localized;
  body: Localized;
};

export type Project = {
  id: string;
  layout: ProjectLayout;
  title: Localized;
  summary: Localized;
  status?: Localized;
  role?: Localized;
  decision?: Localized;
  context?: Localized;
  hardPart?: Localized;
  outcome?: Localized;
  breakdown?: BreakdownRow[];
  tags: string[];
  sourceUrl?: string;
  screenshot?: {
    src: string;
    alt: Localized;
    caption: Localized;
    width: number;
    height: number;
  };
};

export const projects: Project[] = [
  {
    id: "vocalocart",
    layout: "image-first",
    title: { ja: "VocaloCart", en: "VocaloCart" },
    summary: {
      ja: "ボーカロイド関連グッズの EC。Next.js 16 で認証・決済・在庫・管理画面まで一人で構築。",
      en: "An e-commerce shop for Vocaloid merchandise—auth, Stripe checkout, inventory, and an admin panel, built end to end solo on Next.js 16.",
    },
    status: {
      ja: "個人開発 · ソース公開",
      en: "Solo build · source on GitHub",
    },
    role: {
      ja: "個人開発：スキーマ・API・フロント・決済",
      en: "Solo: schema, API, frontend, payments",
    },
    decision: {
      ja: "注文トランザクション内で在庫を条件付き減算し、Stripe Webhook を冪等に処理して二重決済とオーバーセルを防ぐ。",
      en: "Conditional stock decrement inside the order transaction, plus idempotent Stripe PaymentIntent and webhook handling, to prevent double charges and oversell.",
    },
    tags: [
      "TypeScript",
      "Next.js 16",
      "Prisma",
      "PostgreSQL",
      "NextAuth.js v5",
      "Stripe",
      "Zod",
      "Vitest",
    ],
    sourceUrl: "https://github.com/murasakijyuutann/vocaloidshop-fullstack",
    screenshot: {
      src: "/screenshots/vocalocart.webp",
      alt: {
        ja: "VocaloCart の商品一覧画面",
        en: "VocaloCart storefront product listing",
      },
      caption: {
        ja: "ストアフロント · 商品一覧",
        en: "Storefront · product listing",
      },
      width: 1600,
      height: 1000,
    },
  },
  {
    id: "hr-audit",
    layout: "breakdown",
    title: {
      ja: "社内 HR システム セキュリティ監査",
      en: "Internal HR system security audit",
    },
    summary: {
      ja: "ソース非公開の本番 WAR を単独でデコンパイルし、脆弱性と DB 設計問題を文書化。経営判断に直結する監査レポートを提出。",
      en: "Solo reverse-engineering of a production WAR with no source provided—documented vulnerabilities and DB design issues in a report that informed a management decision.",
    },
    context: {
      ja: "株式会社インフォシア・テク · 2026/02–03",
      en: "Infocia Tech · Feb–Mar 2026",
    },
    hardPart: {
      ja: "ソースが一切ない状態から WAR を解析し、IDOR・パストラバーサル・ハードコード AES 鍵・Spring Security ロール不備などを特定。",
      en: "No source available—decompiled the WAR and identified IDOR, path traversal, hardcoded AES keys, and Spring Security role-check gaps.",
    },
    outcome: {
      ja: "70件超の問題（脆弱性 28・DB 問題 28 を含む）を3フェーズのレポートに整理。商用 HR 導入判断に貢献。技術根拠は GitHub で公開。",
      en: "Documented 70+ issues (including 28 vulnerabilities and 28 DB problems) across a three-phase report that contributed to adopting commercial HR software. Technical basis published on GitHub.",
    },
    breakdown: [
      {
        label: { ja: "手法", en: "METHOD" },
        body: {
          ja: "WAR デコンパイルによるリバースエンジニアリングと、バックエンド横断の体系的レビュー。",
          en: "WAR decompilation plus a systematic backend-wide review.",
        },
      },
      {
        label: { ja: "重大所見", en: "CRITICAL FINDINGS" },
        body: {
          ja: "IDOR、パストラバーサル、ハードコード AES 鍵による可逆暗号、Spring Security ロールチェック不備。",
          en: "IDOR, path traversal, reversible crypto with hardcoded AES keys, incomplete Spring Security role checks.",
        },
      },
      {
        label: { ja: "成果物", en: "DELIVERABLE" },
        body: {
          ja: "3フェーズの監査レポートと、再設計提案（hr_rebuild_project）。",
          en: "Three-phase audit report and redesign proposal (hr_rebuild_project).",
        },
      },
    ],
    tags: ["Java", "Spring Boot", "Spring Security", "MySQL", "Decompiler"],
    sourceUrl: "https://github.com/murasakijyuutann/hr_rebuild_project",
  },
  {
    id: "cafe-kiosk",
    layout: "text-first",
    title: {
      ja: "カフェ向けタッチパネル注文システム",
      en: "Cafe touch-panel ordering system",
    },
    summary: {
      ja: "SPACE CL 研修でチームリーダーとして参加。Spring Boot 3 の RESTful API を設計・実装し、React Native フロントと統合。",
      en: "Team lead at SPACE CL training—designed and implemented a Spring Boot 3 REST API and integrated it with a React Native front end.",
    },
    role: {
      ja: "チームリーダー（5名）· バックエンド API 主導",
      en: "Team lead (5) · led backend API design",
    },
    decision: {
      ja: "フロントと連携しやすい REST 仕様を先に固め、Spring Boot 3 で保守しやすいコードベースを構築。",
      en: "Locked an integration-friendly REST contract first, then built a maintainable Spring Boot 3 codebase around it.",
    },
    tags: ["Java 21", "Spring Boot 3", "React Native", "MySQL", "Docker", "AWS"],
    sourceUrl: "https://github.com/murasakijyuutann/cafe_kiosk_full_stack",
    screenshot: {
      src: "/screenshots/cafe-kiosk.webp",
      alt: {
        ja: "カフェキオスク注文画面",
        en: "Cafe kiosk ordering screen",
      },
      caption: {
        ja: "タッチパネル注文 UI",
        en: "Touch-panel ordering UI",
      },
      width: 1600,
      height: 1000,
    },
  },
  {
    id: "transport-payment",
    layout: "text-first",
    title: {
      ja: "Transport Payment System",
      en: "Transport Payment System",
    },
    summary: {
      ja: "交通決済 API を中心としたフルスタック個人開発。Spring Boot・React TypeScript・MySQL で認証から注文管理まで実装し、Docker 化。",
      en: "A personal fullstack transport-payment API—Spring Boot, React TypeScript, and MySQL covering auth through order flows, packaged with Docker.",
    },
    role: {
      ja: "個人開発：API・フロント・デプロイ構成",
      en: "Solo: API, frontend, deploy setup",
    },
    hardPart: {
      ja: "エンタープライズ寄りの設計を独学で再現しつつ、Railway / Vercel 向けに Docker 化して本番相当の構成に載せる。",
      en: "Recreating enterprise-shaped design while learning, then Dockerizing for Railway/Vercel-style production hosting.",
    },
    tags: [
      "Java 21",
      "Spring Boot 3",
      "React",
      "TypeScript",
      "MySQL",
      "Docker",
    ],
    sourceUrl: "https://github.com/murasakijyuutann",
    screenshot: {
      src: "/screenshots/transport-payment.webp",
      alt: {
        ja: "交通決済システムの画面",
        en: "Transport payment system screen",
      },
      caption: {
        ja: "決済・管理 UI",
        en: "Payment / admin UI",
      },
      width: 1600,
      height: 1000,
    },
  },
];
