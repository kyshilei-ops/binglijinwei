"use client";

import { useEffect } from "react";
import { useLang } from "@/lib/LanguageContext";

interface Props {
  titleZh: string;
  titleEn: string;
  descriptionZh?: string;
  descriptionEn?: string;
}

export function LocalizedPageMetadata({ titleZh, titleEn, descriptionZh, descriptionEn }: Props) {
  const { lang } = useLang();

  useEffect(() => {
    const company = lang === "zh" ? "秉立锦为" : "Binglijinwei";
    const title = lang === "zh" ? titleZh : titleEn;
    const description = lang === "zh" ? descriptionZh : descriptionEn;

    document.title = title === company ? company : `${title} | ${company}`;
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";

    if (description) {
      let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "description";
        document.head.appendChild(meta);
      }
      meta.content = description;
    }
  }, [descriptionEn, descriptionZh, lang, titleEn, titleZh]);

  return null;
}
