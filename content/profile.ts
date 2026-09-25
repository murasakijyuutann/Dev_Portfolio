import type { Localized } from "@/lib/i18n";

export const profile = {
  name: {
    display: "Woo Sunmyung",
    ja: "禹 善明",
    reading: "ウ ソンミョン",
  },
  city: {
    ja: "大阪",
    en: "Osaka, Japan",
  } satisfies Localized,
  eyebrow: {
    ja: "大阪 · フルスタック職を希望",
    en: "Osaka, Japan · open to full-stack roles",
  } satisfies Localized,
  role: {
    ja: "フルスタックエンジニア — TypeScript / React / Spring Boot · バックエンド寄り",
    en: "Full-stack engineer — TypeScript / React / Spring Boot · backend focus",
  } satisfies Localized,
  pitch: {
    ja: "本番システムの監査から API・決済の設計まで、ドメインを先に固め、トレードオフを日本語・英語・韓国語で説明できます。",
    en: "From production security audits to payment APIs, I model the domain first—and I can explain the trade-offs in Japanese, English, or Korean.",
  } satisfies Localized,
  email: "ronald.knife@gmail.com",
  github: "https://github.com/murasakijyuutann",
  githubLabel: "github.com/murasakijyuutann",
  qiita: "https://qiita.com/murasakijyuutann",
  resumeHref: "/resume-ja.pdf",
  languages: {
    ja: "KO · JA N1 · EN",
    en: "KO · JA N1 · EN",
  } satisfies Localized,
  meta: {
    title: {
      ja: "禹 善明 — フルスタックエンジニア",
      en: "Woo Sunmyung — Full-stack engineer",
    } satisfies Localized,
    description: {
      ja: "TypeScript / React / Spring Boot を軸にしたフルスタックエンジニア。バックエンド設計とセキュリティ監査の実績。大阪。",
      en: "Full-stack engineer focused on TypeScript, React, and Spring Boot—backend design and security audit experience. Based in Osaka.",
    } satisfies Localized,
  },
} as const;
