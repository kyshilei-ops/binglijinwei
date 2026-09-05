"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";
import { ResolvedImage } from "@/components/ui/ResolvedImage";
import { supabase } from "@/lib/supabase";
import { LocalizedPageMetadata } from "@/components/ui/LocalizedPageMetadata";

const C = { primary: "#9cc211", primaryBg: "#f4fae6", dark: "#1a202c", body: "#848484", light: "#f7f7f7" };

interface Feature { icon: string; title_zh: string; title_en: string; desc_zh: string; desc_en: string; }
interface AboutPageData {
  content_zh?: string;
  content_en?: string;
  image_url?: string;
  years_text?: string;
  years_label_zh?: string;
  years_label_en?: string;
  features_json?: string;
  heading_zh?: string;
  heading_en?: string;
  banner_sub_zh?: string;
  banner_sub_en?: string;
}
const defaultFeatures: Feature[] = [
  { icon: "fa-check-circle", title_zh: "专业选型", title_en: "Product Selection", desc_zh: "根据作业环境与需求提供清晰的设备选型建议", desc_en: "Clear equipment recommendations based on working conditions and requirements" },
  { icon: "fa-cogs", title_zh: "可靠设备", title_en: "Reliable Equipment", desc_zh: "专注微耕机、水泵等实用小型农业机械", desc_en: "Practical compact agricultural equipment including micro tillers and water pumps" },
  { icon: "fa-shield-alt", title_zh: "品质保证", title_en: "Quality Guarantee", desc_zh: "所有产品均通过严格质量检测", desc_en: "All products pass strict quality testing" },
  { icon: "fa-headset", title_zh: "售后支持", title_en: "After-sales Support", desc_zh: "提供使用指导、配件与售后支持", desc_en: "Operation guidance, spare-parts and after-sales support" },
];

export default function AboutPage() {
  const { lang } = useLang();
  const [data, setData] = useState<AboutPageData>({});

  useEffect(() => {
    supabase.from("about_content").select("*").limit(1).single().then(({ data: row }) => {
      if (row) setData(row);
    });
  }, []);

  const aboutText = (lang === "zh" ? (data.content_zh || "") : (data.content_en || data.content_zh || "")) || "";
  const features: Feature[] = (() => { try { return JSON.parse(data.features_json || "[]"); } catch { return defaultFeatures; } })();
  if (features.length === 0) features.push(...defaultFeatures);

  return (
    <>
      <Header />
      <LocalizedPageMetadata
        titleZh="关于我们"
        titleEn="About Us"
        descriptionZh="了解秉立锦为的小型农业机械产品、质量理念与服务支持。"
        descriptionEn="Learn about Binglijinwei agricultural equipment, quality standards and service support."
      />
      <main className="flex-1">
        <section className="py-20 text-center" style={{ background: "linear-gradient(to right, #1a202c, #2d3748)" }}>
          <div className="container">
            <h1 className="text-4xl font-bold text-white mb-3">{t("page_about", lang)}</h1>
            <p className="text-gray-300 max-w-2xl mx-auto">{lang === "zh" ? (data.banner_sub_zh || "专注小型农业机械与可靠服务") : (data.banner_sub_en || "Compact Agricultural Equipment & Reliable Support")}</p>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-20">
              <div>
                <p className="text-lg font-medium mb-2" style={{ color: C.primary }}>{t("page_about", lang)}</p>
                <h2 className="text-3xl font-bold mb-6" style={{ color: C.dark }}>
                  {lang === "zh" ? (data.heading_zh || "让可靠设备更好地服务每一次耕作与灌溉") : (data.heading_en || "Reliable Equipment for Cultivation and Irrigation")}
                </h2>
                <div className="space-y-4 leading-relaxed" style={{ color: C.body }}>
                  {(aboutText || (lang === "zh" ? "秉立锦为专注于微耕机、汽油机水泵等小型农业机械，为客户提供产品选型、使用指导与售后支持。" : "Binglijinwei supplies compact agricultural equipment including micro tillers and gasoline water pumps, with product selection, operation guidance and after-sales support."))
                    .split("\n").filter(Boolean).map((line: string, i: number) => <p key={i}>{line}</p>)}
                </div>
              </div>
              <div className="relative h-80 md:h-96 rounded-lg overflow-hidden" style={{ backgroundColor: C.light }}>
                {data.image_url ? (
                  <ResolvedImage src={data.image_url} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                ) : (
                  <>
                    <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-30" style={{ color: C.primary }}>🌿</div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                      <span className="text-5xl font-bold mb-2" style={{ color: C.primary }}>{data.years_text || "10+"}</span>
                      <span className="text-lg font-medium" style={{ color: C.body }}>{lang === "zh" ? (data.years_label_zh || "年行业经验") : (data.years_label_en || data.years_label_zh || "Years Experience")}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {features.map((f) => (
                <div key={f.title_zh} className="text-center group">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: C.primaryBg, color: C.primary }}>
                    <i className={`fas ${f.icon}`}></i>
                  </div>
                  <h3 className="font-semibold mb-2" style={{ color: C.dark }}>{lang === "zh" ? f.title_zh : f.title_en}</h3>
                  <p className="text-sm" style={{ color: C.body }}>{lang === "zh" ? f.desc_zh : f.desc_en}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
