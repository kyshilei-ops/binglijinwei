"use client";

import { useState } from "react";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";

export function NewsletterSection() {
  const { lang } = useLang();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (email) { setSubmitted(true); setEmail(""); } };

  return (
    <section className="py-20 bg-gradient-to-r from-[#1a202c] to-[#2d3748]">
      <div className="container text-center">
        <div className="max-w-xl mx-auto">
          <p className="text-[#4caf50] font-medium text-lg mb-2 uppercase tracking-wide">{t("newsletter_subtitle", lang)}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t("newsletter_title", lang)} <span className="text-[#4caf50]">{t("newsletter_highlight", lang)}</span></h2>
          <p className="text-gray-300 mb-8">{t("newsletter_desc", lang)}</p>
          {submitted ? (
            <div className="bg-[#4caf50]/20 border border-[#4caf50] text-[#4caf50] rounded-lg p-4 text-center">
              <i className="fas fa-check-circle text-2xl mb-2"></i>
              <p className="font-medium">{t("newsletter_success_title", lang)}</p>
              <p className="text-sm mt-1">{t("newsletter_success_desc", lang)}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("newsletter_placeholder", lang)} required className="flex-1 px-5 py-3 rounded-md border-0 text-[#1a202c] focus:ring-2 focus:ring-[#4caf50] outline-none" />
              <button type="submit" className="px-6 py-3 bg-[#4caf50] hover:bg-[#388e3c] text-white font-medium rounded-md transition-colors whitespace-nowrap">{t("newsletter_btn", lang)}</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
