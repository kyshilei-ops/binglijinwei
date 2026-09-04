import type { Lang } from "./i18n";

export interface LocalizedField {
  zh: string;
  en: string;
}

/**
 * Keeps bilingual free-form fields in one existing database column. Older
 * plain-text values remain readable, so previously saved posts are preserved.
 */
export function decodeLocalizedField(value: string | null | undefined): LocalizedField {
  if (!value) return { zh: "", en: "" };

  try {
    const parsed = JSON.parse(value);
    if (parsed && typeof parsed === "object" && (typeof parsed.zh === "string" || typeof parsed.en === "string")) {
      return { zh: parsed.zh || "", en: parsed.en || "" };
    }
  } catch {
    // Legacy content is stored as ordinary text or HTML.
  }

  return { zh: value, en: "" };
}

export function encodeLocalizedField(zh: string, en: string) {
  return JSON.stringify({ zh, en });
}

export function localizedField(value: string | null | undefined, lang: Lang) {
  const localized = decodeLocalizedField(value);
  return lang === "en" ? (localized.en || localized.zh) : (localized.zh || localized.en);
}
