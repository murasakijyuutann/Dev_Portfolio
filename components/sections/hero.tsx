import { buttonVariants } from "@/components/ui/button";
import { profile } from "@/content/profile";
import { t, ui, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type HeroProps = {
  locale: Locale;
};

export function Hero({ locale }: HeroProps) {
  return (
    <section
      className="mx-auto grid max-w-page grid-cols-12 gap-x-6 gap-y-8 px-4 py-[clamp(3.5rem,10vw,7.5rem)] pb-[clamp(3rem,8vw,6rem)]"
      aria-labelledby="hero-name"
    >
      <div className="col-span-12 md:col-span-8">
        <p className="meta mb-6">{t(profile.eyebrow, locale)}</p>
        <h1
          id="hero-name"
          className="font-display text-hero font-semibold tracking-tight"
        >
          {profile.name.display}
          <span className="text-primary" aria-hidden="true">
            _
          </span>
        </h1>
        <p className="mt-7 font-display text-subhead font-medium">
          {t(profile.role, locale)}
        </p>
        <p className="mt-4 max-w-[52ch] text-muted-foreground">
          {t(profile.pitch, locale)}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#projects"
            className={cn(buttonVariants({ variant: "primary" }), "no-underline")}
          >
            {t(ui.actions.seeWork, locale)}
          </a>
          <a
            href={profile.resumeHref}
            className={cn(buttonVariants({ variant: "outline" }), "no-underline")}
          >
            {t(ui.actions.resume, locale)}
          </a>
        </div>
      </div>
      <aside
        className="col-span-12 self-end md:col-span-3 md:col-start-10"
        aria-label="Links"
      >
        <ul className="grid gap-2.5 border-t border-border-strong pt-3.5">
          <li className="flex justify-between gap-3">
            <span className="meta">GitHub</span>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="meta text-primary"
            >
              {profile.githubLabel}
            </a>
          </li>
          <li className="flex justify-between gap-3">
            <span className="meta">Email</span>
            <a href={`mailto:${profile.email}`} className="meta text-primary">
              {profile.email}
            </a>
          </li>
          <li className="flex justify-between gap-3">
            <span className="meta">Languages</span>
            <span className="meta text-foreground">
              {t(profile.languages, locale)}
            </span>
          </li>
        </ul>
      </aside>
    </section>
  );
}
