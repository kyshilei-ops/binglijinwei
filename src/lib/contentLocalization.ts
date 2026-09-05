import type { Lang } from "./i18n";
import { localizedField } from "./localizedFields";

const categoryTranslations: Record<string, string> = {
  "汽油机水泵": "Gasoline Water Pumps",
  "水泵": "Water Pumps",
  "微耕机": "Micro Tillers",
  "柴油微耕机": "Diesel Micro Tillers",
};

const badgeTranslations: Record<string, { zh: string; en: string }> = {
  "新产品": { zh: "新产品", en: "New Product" },
  "新品": { zh: "新品", en: "New" },
  "New Product": { zh: "新产品", en: "New Product" },
  "New": { zh: "新品", en: "New" },
  "参展产品": { zh: "参展产品", en: "Exhibition Model" },
  "展会产品": { zh: "展会产品", en: "Exhibition Model" },
  "Exhibition Model": { zh: "参展产品", en: "Exhibition Model" },
  "热销": { zh: "热销", en: "Popular" },
  "Hot": { zh: "热销", en: "Popular" },
  "促销": { zh: "优惠", en: "Special Offer" },
  "Sale": { zh: "优惠", en: "Special Offer" },
};

export function cleanEnglishCategory(value: string | null | undefined) {
  return (value || "")
    .replace(/^(英文分类|英语分类)\s*[:：-]?\s*/i, "")
    .trim();
}

export function localizedProductCategory(
  category: string | null | undefined,
  categoryEn: string | null | undefined,
  lang: Lang,
) {
  const zh = (category || "").trim();
  if (lang === "zh") return zh;
  return cleanEnglishCategory(categoryEn) || categoryTranslations[zh] || zh;
}

export function localizedProductBadge(badge: string | null | undefined, lang: Lang) {
  const value = (badge || "").trim();
  if (!value) return "";
  return badgeTranslations[value]?.[lang] || value;
}

export function localizedBlogCategory(
  category: string | null | undefined,
  categoryEn: string | null | undefined,
  lang: Lang,
) {
  const zh = (category || "").trim();
  if (lang === "zh") return zh;
  return cleanEnglishCategory(categoryEn) || categoryTranslations[zh] || zh;
}

export function localizedAuthor(value: string | null | undefined, lang: Lang) {
  const author = localizedField(value, lang).trim();
  if (lang === "en" && (!author || author === "管理员" || author === "管理員")) return "Binglijinwei";
  if (lang === "zh" && (!author || author === "Administrator" || author === "Admin")) return "秉立锦为";
  return author || (lang === "zh" ? "秉立锦为" : "Binglijinwei");
}
