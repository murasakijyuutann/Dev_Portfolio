import { skillGroups } from "@/content/skills";
import { t, ui, type Locale } from "@/lib/i18n";

type SkillsProps = {
  locale: Locale;
};

export function Skills({ locale }: SkillsProps) {
  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="border-t border-border py-[clamp(3.5rem,8vw,6.5rem)]"
    >
      <div className="mx-auto max-w-page px-4">
        <div className="mb-[clamp(2rem,5vw,3.5rem)] flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="skills-heading" className="font-display text-section font-semibold">
            {t(ui.sections.skills, locale)}
          </h2>
          <span className="meta">{t(ui.meta.skillsHint, locale)}</span>
        </div>
        <div className="grid gap-10 md:grid-cols-3">
          {skillGroups.map((group) => (
            <div key={group.id}>
              <h3 className="font-display text-subhead font-medium">
                {t(group.title, locale)}
              </h3>
              <ul className="mt-4 space-y-3">
                {group.items.map((item) => (
                  <li
                    key={item.name}
                    className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-2"
                  >
                    <span>{item.name}</span>
                    <a
                      href={item.href}
                      className="meta text-primary no-underline hover:underline"
                    >
                      {t(item.evidence, locale)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
