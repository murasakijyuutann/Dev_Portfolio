import { CaseStudyBreakdown } from "@/components/case-study/case-study-breakdown";
import { CaseStudyImageFirst } from "@/components/case-study/case-study-image-first";
import { CaseStudyTextFirst } from "@/components/case-study/case-study-text-first";
import { projects } from "@/content/projects";
import { t, ui, type Locale } from "@/lib/i18n";

type ProjectsProps = {
  locale: Locale;
};

export function Projects({ locale }: ProjectsProps) {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="border-t border-border py-[clamp(3.5rem,8vw,6.5rem)]"
    >
      <div className="mx-auto max-w-page px-4">
        <div className="mb-[clamp(2rem,5vw,3.5rem)] flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="projects-heading" className="font-display text-section font-semibold">
            {t(ui.sections.projects, locale)}
          </h2>
          <span className="meta">{t(ui.meta.projectsCount, locale)}</span>
        </div>
        {projects.map((project) => {
          if (project.layout === "image-first") {
            return (
              <CaseStudyImageFirst
                key={project.id}
                locale={locale}
                project={project}
              />
            );
          }
          if (project.layout === "breakdown") {
            return (
              <CaseStudyBreakdown
                key={project.id}
                locale={locale}
                project={project}
              />
            );
          }
          return (
            <CaseStudyTextFirst
              key={project.id}
              locale={locale}
              project={project}
            />
          );
        })}
      </div>
    </section>
  );
}
