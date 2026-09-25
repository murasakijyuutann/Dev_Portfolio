import type { Localized } from "@/lib/i18n";

export type SkillGroup = {
  id: string;
  title: Localized;
  items: {
    name: string;
    evidence: Localized;
    href: string;
  }[];
};

export const skillGroups: SkillGroup[] = [
  {
    id: "backend",
    title: { ja: "Backend", en: "Backend" },
    items: [
      {
        name: "Spring Boot 3",
        evidence: { ja: "Cafe kiosk API", en: "Cafe kiosk API" },
        href: "#projects",
      },
      {
        name: "API design / REST",
        evidence: { ja: "SPACE CL（リード）", en: "SPACE CL (lead)" },
        href: "#projects",
      },
      {
        name: "Prisma + PostgreSQL",
        evidence: { ja: "VocaloCart", en: "VocaloCart" },
        href: "#projects",
      },
      {
        name: "Stripe / Webhooks",
        evidence: { ja: "VocaloCart 決済", en: "VocaloCart payments" },
        href: "#projects",
      },
      {
        name: "Security review",
        evidence: { ja: "HR WAR 監査", en: "HR WAR audit" },
        href: "#projects",
      },
    ],
  },
  {
    id: "frontend",
    title: { ja: "Frontend", en: "Frontend" },
    items: [
      {
        name: "TypeScript",
        evidence: { ja: "VocaloCart", en: "VocaloCart" },
        href: "#projects",
      },
      {
        name: "Next.js (App Router)",
        evidence: { ja: "VocaloCart", en: "VocaloCart" },
        href: "#projects",
      },
      {
        name: "React",
        evidence: { ja: "Transport Payment", en: "Transport Payment" },
        href: "#projects",
      },
      {
        name: "React Native",
        evidence: { ja: "Cafe kiosk", en: "Cafe kiosk" },
        href: "#projects",
      },
    ],
  },
  {
    id: "mobile-infra",
    title: { ja: "Mobile & infra", en: "Mobile & infra" },
    items: [
      {
        name: "Kotlin / Jetpack Compose",
        evidence: { ja: "Infocia Android", en: "Infocia Android" },
        href: "#journey",
      },
      {
        name: "BLE / GPS",
        evidence: { ja: "ナビアプリ", en: "Navigation app" },
        href: "#journey",
      },
      {
        name: "Docker / AWS RDS",
        evidence: { ja: "Cafe kiosk", en: "Cafe kiosk" },
        href: "#projects",
      },
      {
        name: "Java",
        evidence: { ja: "監査 · Spring", en: "Audit · Spring" },
        href: "#projects",
      },
    ],
  },
];
