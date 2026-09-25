import { SiteHeader } from "@/components/site-header";
import { Contact } from "@/components/sections/contact";
import { Hero } from "@/components/sections/hero";
import { Journey } from "@/components/sections/journey";
import { Projects } from "@/components/sections/projects";
import { Skills } from "@/components/sections/skills";
import { isLocale, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;

  return (
    <>
      <SiteHeader locale={locale} />
      <main id="top">
        <Hero locale={locale} />
        <Projects locale={locale} />
        <Journey locale={locale} />
        <Skills locale={locale} />
        <Contact locale={locale} />
      </main>
    </>
  );
}
