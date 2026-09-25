import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import {
  IBM_Plex_Sans,
  JetBrains_Mono,
  Noto_Sans_JP,
  Space_Grotesk,
} from "next/font/google";
import { profile } from "@/content/profile";
import {
  defaultLocale,
  isLocale,
  locales,
  t,
  type Locale,
} from "@/lib/i18n";
import "../globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});
const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});
const jp = Noto_Sans_JP({
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-jp",
  display: "swap",
  preload: false,
});

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  return {
    metadataBase: new URL("https://example.com"),
    title: t(profile.meta.title, locale),
    description: t(profile.meta.description, locale),
    alternates: {
      languages: {
        ja: "/ja/",
        en: "/en/",
      },
    },
    openGraph: {
      title: t(profile.meta.title, locale),
      description: t(profile.meta.description, locale),
      locale: locale === "ja" ? "ja_JP" : "en_US",
      type: "website",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw;

  return (
    <html
      lang={locale}
      className={`dark ${display.variable} ${sans.variable} ${mono.variable} ${jp.variable}`}
    >
      <body className="grain min-h-dvh bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
