"use client";

import Link from "next/link";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";

export function CountdownBanner() {
  const { lang } = useLang();

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a202c] to-[#2d3748]" />
      <div className="container relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          <div className="max-w-3xl text-center lg:text-left">
            <p className="text-[#4caf50] font-medium text-lg mb-2 uppercase tracking-wide">{t("countdown_subtitle", lang)}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t("countdown_title", lang)} <span className="text-[#4caf50]">{t("countdown_highlight", lang)}</span></h2>
            <p className="text-gray-300 text-lg max-w-2xl">{t("countdown_desc", lang)}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 shrink-0">
            <Link href="/products" className="inline-flex items-center px-7 py-3 text-white font-medium rounded-md transition-colors" style={{ backgroundColor: "#9cc211" }}>
              {t("countdown_btn", lang)} <i className="fas fa-arrow-right ml-2"></i>
            </Link>
            <Link href="/contact" className="inline-flex items-center px-7 py-3 border border-white/60 text-white hover:bg-white hover:text-[#1a202c] font-medium rounded-md transition-colors">
              {t("nav_contact", lang)}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
