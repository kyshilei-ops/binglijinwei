"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";
import { useCmsSettings } from "@/lib/supabaseData";

const C = { primary: "#9cc211", primaryBg: "#f4fae6", dark: "#1a202c", body: "#4a5568" };

export default function ContactPage() {
  const { lang } = useLang();
  const settings = useCmsSettings();

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="py-16 text-center" style={{ background: "linear-gradient(to right, #1a202c, #2d3748)" }}>
          <h1 className="text-4xl font-bold text-white">{t("nav_contact", lang)}</h1>
          <p className="text-gray-300 mt-3">{settings.site_name}</p>
        </section>

        <section className="py-16 bg-white">
          <div className="container max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-bold mb-6" style={{ color: C.dark }}>{t("nav_contact", lang)}</h2>
                <form className="space-y-4">
                  <div>
                    <input type="text" placeholder={t("contact_name", lang)} className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none" style={{ "--tw-ring-color": C.primary } as any} />
                  </div>
                  <div>
                    <input type="email" placeholder={t("contact_email", lang)} className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none" />
                  </div>
                  <div>
                    <textarea rows={5} placeholder={t("contact_message", lang)} className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none"></textarea>
                  </div>
                  <button type="submit" className="text-white px-8 py-3 rounded-md font-medium transition-colors" style={{ backgroundColor: C.primary }}>
                    {t("contact_send", lang)}
                  </button>
                </form>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-6" style={{ color: C.dark }}>{t("contact_info_title", lang)}</h2>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: C.primaryBg, color: C.primary }}><i className="fas fa-map-marker-alt"></i></div>
                    <div><h4 className="font-semibold" style={{ color: C.dark }}>{t("contact_address_label", lang)}</h4><p className="text-sm" style={{ color: C.body }}>{lang === "zh" ? settings.address : (settings.address_en || settings.address)}</p></div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: C.primaryBg, color: C.primary }}><i className="fas fa-phone"></i></div>
                    <div><h4 className="font-semibold" style={{ color: C.dark }}>{t("contact_phone_label", lang)}</h4><p className="text-sm" style={{ color: C.body }}>{settings.phone}</p></div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: C.primaryBg, color: C.primary }}><i className="fas fa-envelope"></i></div>
                    <div><h4 className="font-semibold" style={{ color: C.dark }}>{t("contact_email_label", lang)}</h4><p className="text-sm" style={{ color: C.body }}>{settings.email}</p></div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: C.primaryBg, color: C.primary }}><i className="far fa-clock"></i></div>
                    <div><h4 className="font-semibold" style={{ color: C.dark }}>{t("contact_hours_label", lang)}</h4><p className="text-sm" style={{ color: C.body }}>{lang === "zh" ? settings.working_hours : (settings.working_hours_en || settings.working_hours)}</p></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
