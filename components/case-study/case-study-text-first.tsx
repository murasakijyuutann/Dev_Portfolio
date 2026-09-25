import { Screenshot } from "@/components/screenshot";
import type { Project } from "@/content/projects";
import { t, ui, type Locale } from "@/lib/i18n";

type CaseStudyProps = {
  locale: Locale;
  project: Project;
};

function Tags({ tags }: { tags: string[] }) {
  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <span
          key={tag}
          className="meta rounded border border-border px-2 py-0.5 tracking-wider"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

function SourceLink({ locale, href }: { locale: Locale; href: string }) {
  return (
    <div className="mt-5">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-small text-primary"
      >
        {t(ui.actions.source, locale)}
      </a>
    </div>
  );
}

export function CaseStudyTextFirst({ locale, project }: CaseStudyProps) {
  return (
    <article className="grid grid-cols-12 gap-x-6 gap-y-6 border-t border-border py-10">
      <div className="col-span-12 md:col-span-5">
        <h3 className="font-display text-subhead font-semibold">
          {t(project.title, locale)}
        </h3>
        <p className="mt-2 text-muted-foreground">{t(project.summary, locale)}</p>
        <dl className="mt-5 grid grid-cols-[max-content_1fr] gap-x-5 gap-y-2.5">
          {project.role ? (
            <>
              <dt className="meta pt-0.5">{t(ui.field.role, locale)}</dt>
              <dd>{t(project.role, locale)}</dd>
            </>
          ) : null}
          {project.decision ? (
            <>
              <dt className="meta pt-0.5">{t(ui.field.decision, locale)}</dt>
              <dd className="text-muted-foreground">
                {t(project.decision, locale)}
              </dd>
            </>
          ) : null}
          {project.hardPart ? (
            <>
              <dt className="meta pt-0.5">{t(ui.field.hardPart, locale)}</dt>
              <dd className="text-muted-foreground">
                {t(project.hardPart, locale)}
              </dd>
            </>
          ) : null}
        </dl>
        <Tags tags={project.tags} />
        {project.sourceUrl ? (
          <SourceLink locale={locale} href={project.sourceUrl} />
        ) : null}
      </div>
      {project.screenshot ? (
        <div className="col-span-12 md:col-span-6 md:col-start-7">
          <Screenshot locale={locale} {...project.screenshot} />
        </div>
      ) : null}
    </article>
  );
}
