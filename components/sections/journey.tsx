import { journey } from "@/content/journey";
import { t, ui, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type JourneyProps = {
  locale: Locale;
};

export function Journey({ locale }: JourneyProps) {
  return (
    <section
      id="journey"
      aria-labelledby="journey-heading"
      className="border-t border-border py-[clamp(3.5rem,8vw,6.5rem)]"
    >
      <div className="mx-auto max-w-page px-4">
        <div className="mb-[clamp(2rem,5vw,3.5rem)] flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="journey-heading" className="font-display text-section font-semibold">
            {t(ui.sections.journey, locale)}
          </h2>
          <span className="meta">{t(ui.meta.journeyPath, locale)}</span>
        </div>
        <ol className="space-y-0">
          {journey.map((entry) => (
            <li
              key={entry.id}
              className={cn(
                "grid grid-cols-[6.5rem_1fr] gap-x-4 gap-y-1 border-t border-border py-6 sm:grid-cols-[7.5rem_6rem_1fr] sm:gap-x-6",
                entry.current && "border-l-2 border-l-highlight pl-3 sm:pl-4",
              )}
            >
              <span className="meta">{t(entry.date, locale)}</span>
              <span className="meta text-foreground sm:col-start-2">
                {t(entry.place, locale)}
              </span>
              <div className="col-span-2 mt-2 sm:col-span-1 sm:col-start-3 sm:mt-0">
                <h3 className="font-display text-subhead font-medium">
                  {t(entry.title, locale)}
                </h3>
                <p className="mt-1.5 max-w-measure text-muted-foreground">
                  {t(entry.body, locale)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
