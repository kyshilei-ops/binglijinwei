"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";
import { ResolvedImage } from "@/components/ui/ResolvedImage";

const C = { primary: "#9cc211", primaryBg: "#f4fae6", dark: "#1a202c", body: "#848484", light: "#f7f7f7" };

interface Feature { icon: string; title_zh: string; title_en: string; desc_zh: string; desc_en: string; }
const defaultFeatures: Feature[] = [
  { icon: "fa-check-circle", title_zh: "专业团队", title_en: "Expert Team", desc_zh: "拥有多年草坪护理经验的专业技术团队", desc_en: "Professional team with years of lawn care experience" },
  { icon: "fa-leaf", title_zh: "环保理念", title_en: "Eco-Friendly", desc_zh: "采用环保设备和技术，呵护自然环境", desc_en: "Using eco-friendly equipment and techniques" },
  { icon: "fa-shield-alt", title_zh: "品质保证", title_en: "Quality Guarantee", desc_zh: "所有产品均通过严格质量检测", desc_en: "All products pass strict quality testing" },
  { icon: "fa-headset", title_zh: "贴心服务", title_en: "Great Support", desc_zh: "7×24小时客户服务，随时为您排忧解难", desc_en: "24/7 customer service, always here to help" },
];

function loadFromStorage(key: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  return localStorage.getItem(key) || fallback;
}

export default function AboutPage() {
  const { lang } = useLang();
  const [aboutZh, setAboutZh] = useState("");
  const [aboutEn, setAboutEn] = useState("");
  const [aboutImage, setAboutImage] = useState("");
  const [expYears, setExpYears] = useState("10+");
  const [expLabelZh, setExpLabelZh] = useState("年行业经验");
  const [expLabelEn, setExpLabelEn] = useState("Years Experience");
  const [headingZh, setHeadingZh] = useState("致力于提供最优质的草坪护理解决方案");
  const [headingEn, setHeadingEn] = useState("Committed to the Best Lawn Care Solutions");
  const [bannerSubZh, setBannerSubZh] = useState("专业草坪护理与园艺设备");
  const [bannerSubEn, setBannerSubEn] = useState("Professional Lawn Care & Garden Equipment");
  const [features, setFeatures] = useState<Feature[]>(defaultFeatures);

  useEffect(() => {
    setAboutZh(loadFromStorage("cms_about_zh", ""));
    setAboutEn(loadFromStorage("cms_about_en", ""));
    setAboutImage(loadFromStorage("cms_about_image", ""));
    setExpYears(loadFromStorage("cms_about_years", "10+"));
    setExpLabelZh(loadFromStorage("cms_about_years_label_zh", "年行业经验"));
    setExpLabelEn(loadFromStorage("cms_about_years_label_en", "Years Experience"));
    setHeadingZh(loadFromStorage("cms_about_heading_zh", "致力于提供最优质的草坪护理解决方案"));
    setHeadingEn(loadFromStorage("cms_about_heading_en", "Committed to the Best Lawn Care Solutions"));
    setBannerSubZh(loadFromStorage("cms_about_banner_sub_zh", "专业草坪护理与园艺设备"));
    setBannerSubEn(loadFromStorage("cms_about_banner_sub_en", "Professional Lawn Care & Garden Equipment"));
    try { const f = localStorage.getItem("cms_about_features"); if (f) setFeatures(JSON.parse(f)); } catch {}
    const h = () => {
      setAboutZh(loadFromStorage("cms_about_zh", ""));
      setAboutEn(loadFromStorage("cms_about_en", ""));
      setAboutImage(loadFromStorage("cms_about_image", ""));
      setExpYears(loadFromStorage("cms_about_years", "10+"));
      setExpLabelZh(loadFromStorage("cms_about_years_label_zh", "年行业经验"));
      setExpLabelEn(loadFromStorage("cms_about_years_label_en", "Years Experience"));
      setHeadingZh(loadFromStorage("cms_about_heading_zh", "致力于提供最优质的草坪护理解决方案"));
      setHeadingEn(loadFromStorage("cms_about_heading_en", "Committed to the Best Lawn Care Solutions"));
      setBannerSubZh(loadFromStorage("cms_about_banner_sub_zh", "专业草坪护理与园艺设备"));
      setBannerSubEn(loadFromStorage("cms_about_banner_sub_en", "Professional Lawn Care & Garden Equipment"));
      try { const f = localStorage.getItem("cms_about_features"); if (f) setFeatures(JSON.parse(f)); } catch {}
    };
    window.addEventListener("storage", h);
    window.addEventListener("cms-data-changed", h);
    return () => { window.removeEventListener("storage", h); window.removeEventListener("cms-data-changed", h); };
  }, []);

  const aboutText = (lang === "zh" ? aboutZh : (aboutEn || aboutZh)) || "";

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="py-20 text-center" style={{ background: "linear-gradient(to right, #1a202c, #2d3748)" }}>
          <div className="container">
            <h1 className="text-4xl font-bold text-white mb-3">{t("page_about", lang)}</h1>
            <p className="text-gray-300 max-w-2xl mx-auto">{lang === "zh" ? bannerSubZh : (bannerSubEn || bannerSubZh)}</p>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-20">
              <div>
                <p className="text-lg font-medium mb-2" style={{ color: C.primary }}>{t("page_about", lang)}</p>
                <h2 className="text-3xl font-bold mb-6" style={{ color: C.dark }}>
                  {lang === "zh" ? headingZh : (headingEn || headingZh)}
                </h2>
                <div className="space-y-4 leading-relaxed" style={{ color: C.body }}>
                  {(aboutText || (lang === "zh"
                    ? "我们是一家专业的草坪护理和园艺设备供应商，拥有多年的行业经验。"
                    : "We are a professional lawn care and garden equipment supplier with years of industry experience."))
                    .split("\n").filter(Boolean).map((line, i) => <p key={i}>{line}</p>)}
                </div>
              </div>
              <div className="relative h-80 md:h-96 rounded-lg overflow-hidden" style={{ backgroundColor: C.light }}>
                {aboutImage ? (
                  <ResolvedImage src={aboutImage} alt="" fill className="object-cover" />
                ) : (
                  <>
                    <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-30" style={{ color: C.primary }}>🌿</div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                      <span className="text-5xl font-bold mb-2" style={{ color: C.primary }}>{expYears}</span>
                      <span className="text-lg font-medium" style={{ color: C.body }}>{lang === "zh" ? expLabelZh : expLabelEn}</span>
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
