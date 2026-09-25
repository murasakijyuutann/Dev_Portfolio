import type { Localized } from "@/lib/i18n";

export type JourneyEntry = {
  id: string;
  date: Localized;
  place: Localized;
  title: Localized;
  body: Localized;
  current?: boolean;
};

export const journey: JourneyEntry[] = [
  {
    id: "education-au",
    date: { ja: "2015 – 2019", en: "2015 – 2019" },
    place: { ja: "Australia", en: "Australia" },
    title: {
      ja: "UTS:INSEARCH 短期大学士 → Charles Sturt University IT学士（システム管理）",
      en: "UTS:INSEARCH diploma → Charles Sturt University, IT (systems administration)",
    },
    body: {
      ja: "オーストラリアでインフラ寄りの IT 基盤を学び、学士を取得。",
      en: "Built an infrastructure-leaning IT foundation in Australia and completed a bachelor's degree.",
    },
  },
  {
    id: "acorn",
    date: { ja: "2022/11 – 2023/05", en: "2022/11 – 2023/05" },
    place: { ja: "Korea", en: "Korea" },
    title: {
      ja: "Acorn Academy — アパレル通販サイト開発",
      en: "Acorn Academy — apparel e-commerce training project",
    },
    body: {
      ja: "Java Servlet / Spring MVC と Oracle で商品・カート・マイページをチーム開発（7名）。インフラからアプリ開発へ転向。",
      en: "Team of 7 building catalog, cart, and my-page features with Java Servlet / Spring MVC and Oracle—shift from infrastructure into application development.",
    },
  },
  {
    id: "freelance",
    date: { ja: "2023/07 – 2024/11", en: "2023/07 – 2024/11" },
    place: { ja: "Personal", en: "Personal" },
    title: {
      ja: "個人開発 — Transport Payment / EC / Movie Search",
      en: "Independent builds — Transport Payment / EC / Movie Search",
    },
    body: {
      ja: "Spring Boot・React TypeScript・MySQL で複数アプリを実装し、Docker 化して Railway / Vercel に載せる練習を重ねた。",
      en: "Shipped multiple Spring Boot + React TypeScript + MySQL apps, Dockerized them, and practiced Railway / Vercel-style deploys.",
    },
  },
  {
    id: "space-cl",
    date: { ja: "2025/06 – 2025/11", en: "2025/06 – 2025/11" },
    place: { ja: "Japan", en: "Japan" },
    title: {
      ja: "株式会社 SPACE CL — カフェキオスク API（チームリーダー）",
      en: "SPACE CL — cafe kiosk API (team lead)",
    },
    body: {
      ja: "5名チームのリーダーとして Spring Boot 3 REST API を主導し、React Native フロントと統合。",
      en: "Led a team of five on a Spring Boot 3 REST API and integrated it with React Native.",
    },
  },
  {
    id: "infocia-audit",
    date: { ja: "2026/02 – 2026/03", en: "2026/02 – 2026/03" },
    place: { ja: "Japan", en: "Japan" },
    title: {
      ja: "株式会社インフォシア・テク — HR セキュリティ監査",
      en: "Infocia Tech — HR security audit",
    },
    body: {
      ja: "本番 WAR のデコンパイル監査。脆弱性 28 件などを文書化し、商用 HR 導入の判断材料を提出。",
      en: "Production WAR decompile audit—documented findings including 28 vulnerabilities that informed a commercial HR adoption decision.",
    },
  },
  {
    id: "infocia-android",
    date: { ja: "2026/03 – 2026/04", en: "2026/03 – 2026/04" },
    place: { ja: "Japan", en: "Japan" },
    title: {
      ja: "株式会社インフォシア・テク — Android（BLE / GPS）ナビゲーション",
      en: "Infocia Tech — Android BLE / GPS navigation",
    },
    body: {
      ja: "Kotlin / Jetpack Compose で BLE・GPS 機能を実装。大規模本番コードと .aar 構成を短期間で把握。",
      en: "Implemented BLE and GPS features in Kotlin / Jetpack Compose; ramped quickly on a large production codebase and compiled .aar libraries.",
    },
  },
  {
    id: "vocalocart",
    date: { ja: "2026/07 – 現在", en: "2026/07 – now" },
    place: { ja: "Japan", en: "Japan" },
    title: {
      ja: "個人開発 — VocaloCart（Next.js EC）",
      en: "Independent — VocaloCart (Next.js commerce)",
    },
    body: {
      ja: "TypeScript / Next.js を軸に、決済・在庫・認証まで通したフルスタック EC を構築中。大阪でフルスタック職を希望。",
      en: "Building a full commerce stack on TypeScript / Next.js—payments, inventory, auth. Based in Osaka and open to full-stack roles.",
    },
    current: true,
  },
];
