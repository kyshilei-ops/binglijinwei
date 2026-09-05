"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LocalizedPageMetadata } from "@/components/ui/LocalizedPageMetadata";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";
import { useCmsSettings } from "@/lib/supabaseData";

const C = { primary: "#9cc211", primaryBg: "#f4fae6", dark: "#1a202c", body: "#4a5568" };

function ContactContent() {
  const { lang } = useLang();
  const settings = useCmsSettings();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const productName = searchParams.get("product") || "";
  const suggestedMessage = productName
    ? (lang === "zh" ? `您好，我想咨询产品：${productName}` : `Hello, I would like to inquire about: ${productName}`)
    : "";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!settings.email) return;
    const subject = lang === "zh"
      ? `产品询价${productName ? `：${productName}` : ""}`
      : `Product Inquiry${productName ? `: ${productName}` : ""}`;
    const body = lang === "zh"
      ? `姓名：${name}\n联系邮箱：${email}\n\n${message || suggestedMessage}`
      : `Name: ${name}\nEmail: ${email}\n\n${message || suggestedMessage}`;
    window.location.href = `mailto:${settings.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <>
      <Header />
      <LocalizedPageMetadata
        titleZh="联系我们"
        titleEn="Contact Us"
        descriptionZh="联系秉立锦为，获取微耕机、汽油机水泵的产品资料、选型建议与报价。"
        descriptionEn="Contact Binglijinwei for product information, model selection and quotations for micro tillers and gasoline water pumps."
      />
      <main className="flex-1">
        <section className="py-16 text-center" style={{ background: "linear-gradient(to right, #1a202c, #2d3748)" }}>
          <h1 className="text-4xl font-bold text-white">{t("nav_contact", lang)}</h1>
          <p className="text-gray-300 mt-3">{lang === "zh" ? settings.site_name : (settings.site_name_en || settings.site_name)}</p>
        </section>

        <section className="py-16 bg-white">
          <div className="container max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-bold mb-6" style={{ color: C.dark }}>{t("nav_contact", lang)}</h2>
                {productName && <p className="mb-4 rounded-md bg-[#f4fae6] px-4 py-3 text-sm text-[#557000]">{lang === "zh" ? `正在咨询：${productName}` : `Inquiring about: ${productName}`}</p>}
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <input type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder={t("contact_name", lang)} required className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:border-[#9cc211]" />
                  </div>
                  <div>
                    <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={t("contact_email", lang)} required className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none" />
                  </div>
                  <div>
                    <textarea rows={5} value={message} onChange={(event) => setMessage(event.target.value)} placeholder={suggestedMessage || t("contact_message", lang)} required={!suggestedMessage} className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none"></textarea>
                  </div>
                  <button type="submit" disabled={!settings.email} className="text-white px-8 py-3 rounded-md font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50" style={{ backgroundColor: C.primary }}>
                    {t("contact_send", lang)}
                  </button>
                  <p className="text-xs text-gray-400">{lang === "zh" ? "点击后将打开您的邮箱应用并生成询价邮件。" : "This opens your email app with a prepared inquiry message."}</p>
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
                    <div><h4 className="font-semibold" style={{ color: C.dark }}>{t("contact_phone_label", lang)}</h4><a href={`tel:${settings.phone}`} className="text-sm hover:underline" style={{ color: C.body }}>{settings.phone}</a></div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: C.primaryBg, color: C.primary }}><i className="fas fa-envelope"></i></div>
                    <div><h4 className="font-semibold" style={{ color: C.dark }}>{t("contact_email_label", lang)}</h4><a href={`mailto:${settings.email}`} className="text-sm hover:underline break-all" style={{ color: C.body }}>{settings.email}</a></div>
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

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>}>
      <ContactContent />
    </Suspense>
  );
}
