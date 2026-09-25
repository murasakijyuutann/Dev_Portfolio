export const locales = ["ja", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ja";

export type Localized<T = string> = Record<Locale, T>;

export function t<T>(value: Localized<T>, locale: Locale): T {
  return value[locale];
}

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export const ui = {
  nav: {
    projects: { ja: "制作", en: "Projects" },
    journey: { ja: "経歴", en: "Journey" },
    skills: { ja: "スキル", en: "Skills" },
    contact: { ja: "連絡先", en: "Contact" },
  },
  sections: {
    projects: { ja: "主な制作物", en: "Selected work" },
    journey: { ja: "経歴", en: "Journey" },
    skills: { ja: "スキルと根拠", en: "Skills, with evidence" },
    contact: { ja: "連絡先", en: "Contact" },
  },
  meta: {
    projectsCount: { ja: "04 ケーススタディ", en: "04 case studies" },
    journeyPath: { ja: "KR → AU → JP", en: "KR → AU → JP" },
    skillsHint: {
      ja: "使った場所に紐づけています",
      en: "each links to where it was used",
    },
  },
  actions: {
    seeWork: { ja: "制作物を見る", en: "See selected work" },
    resume: { ja: "履歴書（PDF）", en: "Résumé (PDF)" },
    source: { ja: "ソース ↗", en: "Source ↗" },
    github: { ja: "GitHub", en: "GitHub" },
    emailFastest: {
      ja: "メールが一番早いです。日本語・英語・韓国語で返信します。",
      en: "Email is fastest. I reply in Japanese, English or Korean.",
    },
  },
  field: {
    role: { ja: "役割", en: "ROLE" },
    decision: { ja: "判断", en: "DECISION" },
    context: { ja: "文脈", en: "CONTEXT" },
    hardPart: { ja: "難所", en: "HARD PART" },
    outcome: { ja: "結果", en: "OUTCOME" },
  },
  notFound: {
    title: { ja: "ページが見つかりません", en: "Page not found" },
    body: {
      ja: "制作物の一覧へ戻る",
      en: "Back to selected work",
    },
  },
} as const;
