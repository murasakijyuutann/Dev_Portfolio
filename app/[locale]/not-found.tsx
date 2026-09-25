import { buttonVariants } from "@/components/ui/button";
import { defaultLocale, t, ui, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type NotFoundProps = {
  params?: Promise<{ locale?: string }>;
};

export default async function NotFound({ params }: NotFoundProps) {
  const resolved = params ? await params : undefined;
  const locale: Locale =
    resolved?.locale === "en" || resolved?.locale === "ja"
      ? resolved.locale
      : defaultLocale;

  return (
    <main className="mx-auto flex min-h-dvh max-w-page flex-col justify-center gap-6 px-4 py-16">
      <p className="meta">404</p>
      <h1 className="font-display text-section font-semibold">
        {t(ui.notFound.title, locale)}
      </h1>
      <a
        href={`/${locale}/#projects`}
        className={cn(
          buttonVariants({ variant: "primary" }),
          "w-fit no-underline",
        )}
      >
        {t(ui.notFound.body, locale)}
      </a>
    </main>
  );
}
