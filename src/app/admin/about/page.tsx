"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/lib/LanguageContext";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { supabase } from "@/lib/supabase";

interface Feature { icon: string; title_zh: string; title_en: string; desc_zh: string; desc_en: string; }
const defaultFeatures: Feature[] = [
  { icon: "fa-check-circle", title_zh: "专业团队", title_en: "Expert Team", desc_zh: "拥有多年草坪护理经验的专业技术团队", desc_en: "Professional team with years of lawn care experience" },
  { icon: "fa-leaf", title_zh: "环保理念", title_en: "Eco-Friendly", desc_zh: "采用环保设备和技术，呵护自然环境", desc_en: "Using eco-friendly equipment and techniques" },
  { icon: "fa-shield-alt", title_zh: "品质保证", title_en: "Quality Guarantee", desc_zh: "所有产品均通过严格质量检测", desc_en: "All products pass strict quality testing" },
  { icon: "fa-headset", title_zh: "贴心服务", title_en: "Great Support", desc_zh: "7×24小时客户服务，随时为您排忧解难", desc_en: "24/7 customer service, always here to help" },
];

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
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") !== "true") { window.location.href = "/admin"; return; }
    supabase.from("about_content").select("*").limit(1).single().then(({ data }: any) => {
      if (data) {
        setAboutZh(data.content_zh || "");
        setAboutEn(data.content_en || "");
        setAboutImage(data.image_url || "");
        setExpYears(data.years_text || "10+");
        setExpLabelZh(data.years_label_zh || "年行业经验");
        setExpLabelEn(data.years_label_en || "Years Experience");
        try { if (data.features_json) setFeatures(JSON.parse(data.features_json)); } catch {}
        setHeadingZh(data.heading_zh || "致力于提供最优质的草坪护理解决方案");
        setHeadingEn(data.heading_en || "Committed to the Best Lawn Care Solutions");
        setBannerSubZh(data.banner_sub_zh || "专业草坪护理与园艺设备");
        setBannerSubEn(data.banner_sub_en || "Professional Lawn Care & Garden Equipment");
      }
    });
  }, []);

  const handleSave = async () => {
    const payload = {
      id: 1,
      content_zh: aboutZh, content_en: aboutEn, image_url: aboutImage,
      years_text: expYears, years_label_zh: expLabelZh, years_label_en: expLabelEn,
      features_json: JSON.stringify(features),
      heading_zh: headingZh, heading_en: headingEn,
      banner_sub_zh: bannerSubZh, banner_sub_en: bannerSubEn,
    };
    await supabase.from("about_content").upsert(payload);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateFeature = (i: number, key: keyof Feature, value: string) => {
    const updated = [...features];
    updated[i] = { ...updated[i], [key]: value };
    setFeatures(updated);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{lang === "zh" ? "关于我们" : "About Us"}</h1>
        <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors">
          {saved ? <><i className="fas fa-check mr-1"></i>{lang === "zh" ? "已保存！" : "Saved!"}</> : <><i className="fas fa-save mr-1"></i>{lang === "zh" ? "保存全部" : "Save All"}</>}
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{lang === "zh" ? "页面主图" : "Page Image"}</h2>
          <ImageUploader value={aboutImage} onChange={setAboutImage} label="" />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{lang === "zh" ? "Banner 副标题" : "Banner Subtitle"}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-medium text-gray-600 mb-1">中文</label><input value={bannerSubZh} onChange={(e) => setBannerSubZh(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 outline-none" /></div>
            <div><label className="block text-xs font-medium text-gray-600 mb-1">English</label><input value={bannerSubEn} onChange={(e) => setBannerSubEn(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 outline-none" /></div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{lang === "zh" ? "页面主标题" : "Main Heading"}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-medium text-gray-600 mb-1">中文</label><input value={headingZh} onChange={(e) => setHeadingZh(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 outline-none" /></div>
            <div><label className="block text-xs font-medium text-gray-600 mb-1">English</label><input value={headingEn} onChange={(e) => setHeadingEn(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 outline-none" /></div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{lang === "zh" ? "经验年限展示" : "Years of Experience"}</h2>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="block text-xs font-medium text-gray-600 mb-1">{lang === "zh" ? "数字" : "Number"}</label><input value={expYears} onChange={(e) => setExpYears(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 outline-none" /></div>
            <div><label className="block text-xs font-medium text-gray-600 mb-1">{lang === "zh" ? "中文标签" : "Label (CN)"}</label><input value={expLabelZh} onChange={(e) => setExpLabelZh(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 outline-none" /></div>
            <div><label className="block text-xs font-medium text-gray-600 mb-1">{lang === "zh" ? "英文标签" : "Label (EN)"}</label><input value={expLabelEn} onChange={(e) => setExpLabelEn(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 outline-none" /></div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6"><h2 className="text-lg font-semibold text-gray-800 mb-4">{lang === "zh" ? "中文介绍" : "Chinese Content"}</h2><textarea value={aboutZh} onChange={(e) => setAboutZh(e.target.value)} rows={8} className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 outline-none" /></div>
        <div className="bg-white rounded-lg shadow-sm p-6"><h2 className="text-lg font-semibold text-gray-800 mb-4">{lang === "zh" ? "英文介绍" : "English Content"}</h2><textarea value={aboutEn} onChange={(e) => setAboutEn(e.target.value)} rows={8} className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 outline-none" /></div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{lang === "zh" ? "四大特色标语" : "Feature Cards"}</h2>
          <div className="space-y-4">
            {features.map((f, i) => (
              <div key={i} className="p-4 border border-gray-200 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-2">
                  <div><label className="block text-[10px] font-medium text-gray-500 mb-0.5">图标</label><input value={f.icon} onChange={(e) => updateFeature(i, "icon", e.target.value)} className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-green-500 outline-none" /></div>
                  <div><label className="block text-[10px] font-medium text-gray-500 mb-0.5">中文标题</label><input value={f.title_zh} onChange={(e) => updateFeature(i, "title_zh", e.target.value)} className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-green-500 outline-none" /></div>
                  <div><label className="block text-[10px] font-medium text-gray-500 mb-0.5">英文标题</label><input value={f.title_en} onChange={(e) => updateFeature(i, "title_en", e.target.value)} className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-green-500 outline-none" /></div>
                  <div><label className="block text-[10px] font-medium text-gray-500 mb-0.5">预览</label><div className="flex items-center gap-2 h-8 px-2 bg-gray-50 rounded text-lg" style={{ color: "#9cc211" }}><i className={`fas ${f.icon}`}></i></div></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-[10px] font-medium text-gray-500 mb-0.5">中文描述</label><input value={f.desc_zh} onChange={(e) => updateFeature(i, "desc_zh", e.target.value)} className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-green-500 outline-none" /></div>
                  <div><label className="block text-[10px] font-medium text-gray-500 mb-0.5">英文描述</label><input value={f.desc_en} onChange={(e) => updateFeature(i, "desc_en", e.target.value)} className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-green-500 outline-none" /></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
