"use client";

import Link from "next/link";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";

export function NewsletterSection() {
  const { lang } = useLang();

  return (
    <section className="py-20 bg-gradient-to-r from-[#1a202c] to-[#2d3748]">
      <div className="container text-center">
        <div className="max-w-xl mx-auto">
          <p className="text-[#4caf50] font-medium text-lg mb-2 uppercase tracking-wide">{t("newsletter_subtitle", lang)}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t("newsletter_title", lang)} <span className="text-[#4caf50]">{t("newsletter_highlight", lang)}</span></h2>
          <p className="text-gray-300 mb-8">{t("newsletter_desc", lang)}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="px-7 py-3 bg-[#4caf50] hover:bg-[#388e3c] text-white font-medium rounded-md transition-colors">{t("newsletter_btn", lang)}</Link>
            <Link href="/products" className="px-7 py-3 border border-white/60 text-white hover:bg-white hover:text-[#1a202c] font-medium rounded-md transition-colors">{t("countdown_btn", lang)}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
