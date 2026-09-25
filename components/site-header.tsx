"use client";

import { useEffect, useState } from "react";
import { LanguageSwitch } from "@/components/language-switch";
import { profile } from "@/content/profile";
import { t, ui, type Locale } from "@/lib/i18n";

const SECTIONS = [
  { id: "projects", labelKey: "projects" },
  { id: "journey", labelKey: "journey" },
  { id: "skills", labelKey: "skills" },
  { id: "contact", labelKey: "contact" },
] as const;

type SiteHeaderProps = {
  locale: Locale;
};

export function SiteHeader({ locale }: SiteHeaderProps) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const targets = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null,
    );

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    targets.forEach((el) => observer.observe(el));

    const onScroll = () => {
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) setActive(SECTIONS[SECTIONS.length - 1].id);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <nav
        aria-label="Sections"
        className="mx-auto flex h-(--header-height) max-w-page items-center gap-4 px-4 sm:gap-6"
      >
        <a
          href="#top"
          className="shrink-0 font-display text-small font-semibold text-foreground no-underline hover:text-primary"
        >
          {t(profile.name.short, locale)}
        </a>
        <ul className="ml-auto flex items-center gap-3 sm:gap-5">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={active === s.id ? "location" : undefined}
                className="text-small text-muted-foreground no-underline underline-offset-8 hover:text-foreground aria-[current=location]:text-primary aria-[current=location]:underline"
              >
                {t(ui.nav[s.labelKey], locale)}
              </a>
            </li>
          ))}
        </ul>
        <LanguageSwitch locale={locale} />
      </nav>
    </header>
  );
}
