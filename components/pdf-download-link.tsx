import { buttonVariants } from "@/components/ui/button";
import { profile } from "@/content/profile";
import { t, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";

type PdfDoc = (typeof profile.documents)[number];

type PdfDownloadLinkProps = {
  doc: PdfDoc;
  locale: Locale;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  className?: string;
};

export function PdfDownloadLink({
  doc,
  locale,
  variant = "outline",
  className,
}: PdfDownloadLinkProps) {
  return (
    <a
      href={doc.href}
      download={doc.downloadName}
      className={cn(buttonVariants({ variant }), "no-underline", className)}
    >
      {t(doc.label, locale)}
    </a>
  );
}

type PdfDownloadGroupProps = {
  locale: Locale;
  resumeVariant?: VariantProps<typeof buttonVariants>["variant"];
  careerVariant?: VariantProps<typeof buttonVariants>["variant"];
};

export function PdfDownloadGroup({
  locale,
  resumeVariant = "outline",
  careerVariant = "outline",
}: PdfDownloadGroupProps) {
  const [resume, career] = profile.documents;
  return (
    <>
      <PdfDownloadLink doc={resume} locale={locale} variant={resumeVariant} />
      <PdfDownloadLink doc={career} locale={locale} variant={careerVariant} />
    </>
  );
}
