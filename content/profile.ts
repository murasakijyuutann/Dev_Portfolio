import type { Localized } from "@/lib/i18n";

export const profile = {
  name: {
    /** Compact label for header / nav */
    short: {
      ja: "禹 善明",
      en: "Sunmyung Woo",
    } satisfies Localized,
    family: {
      kanji: "禹",
      kana: "ウ",
    },
    given: {
      kanji: "善明",
      kana: "ソンミョン",
    },
    en: "Sunmyung Woo",
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
  documents: [
    {
      id: "resume",
      href: "/resume-ja.pdf",
      downloadName: "Woo_Sunmyung_履歴書.pdf",
      label: { ja: "履歴書（PDF）", en: "Résumé (PDF)" },
    },
    {
      id: "career-history",
      href: "/career-history-ja.pdf",
      downloadName: "Woo_Sunmyung_職務経歴書.pdf",
      label: { ja: "職務経歴書（PDF）", en: "Career history (PDF)" },
    },
  ],
  languages: {
    ja: "KO · JA N1 · EN",
    en: "KO · JA N1 · EN",
  } satisfies Localized,
  meta: {
    title: {
      ja: "禹 善明 — フルスタックエンジニア",
      en: "Sunmyung Woo — Full-stack engineer",
    } satisfies Localized,
    description: {
      ja: "TypeScript / React / Spring Boot を軸にしたフルスタックエンジニア。バックエンド設計とセキュリティ監査の実績。大阪。",
      en: "Full-stack engineer focused on TypeScript, React, and Spring Boot—backend design and security audit experience. Based in Osaka.",
    } satisfies Localized,
  },
} as const;
