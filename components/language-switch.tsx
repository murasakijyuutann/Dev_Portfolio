import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type LanguageSwitchProps = {
  locale: Locale;
};

export function LanguageSwitch({ locale }: LanguageSwitchProps) {
  return (
    <div
      className="inline-flex overflow-hidden rounded border border-input"
      role="group"
      aria-label="Language"
    >
      <Link
        href="/en/"
        hrefLang="en"
        aria-current={locale === "en" ? "page" : undefined}
        className={cn(
          "meta px-2.5 py-1.5 no-underline transition-colors duration-150",
          locale === "en"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-foreground",
        )}
      >
        EN
      </Link>
      <Link
        href="/ja/"
        hrefLang="ja"
        aria-current={locale === "ja" ? "page" : undefined}
        className={cn(
          "meta border-l border-input px-2.5 py-1.5 no-underline transition-colors duration-150",
          locale === "ja"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-foreground",
        )}
      >
        日本語
      </Link>
    </div>
  );
}
