"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/lib/LanguageContext";
import { saveSettings } from "@/lib/supabaseData";
import { supabase } from "@/lib/supabase";
import { t } from "@/lib/i18n";
import { ImageUploader } from "@/components/ui/ImageUploader";

interface SettingItem { site_name: string; site_name_en: string; logo_url: string; phone: string; email: string; address: string; address_en: string; working_hours: string; working_hours_en: string; facebook_url: string; twitter_url: string; instagram_url: string; youtube_url: string; about_zh: string; about_en: string; }
const defaults: SettingItem = { site_name: "LawnMover", site_name_en: "LawnMover", logo_url: "/images/logo.png", phone: "(+91) 123-456-789", email: "info@lawnmover.com", address: "123 Garden Street, Green City, GC 12345", address_en: "123 Garden Street, Green City, GC 12345", working_hours: "Mon - Fri: 8AM - 5PM", working_hours_en: "Mon - Fri: 8AM - 5PM", facebook_url: "#", twitter_url: "#", instagram_url: "#", youtube_url: "#", about_zh: "", about_en: "" };

export default function SettingsPage() {
  const { lang } = useLang();
  const [settings, setSettings] = useState<SettingItem>(defaults);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") !== "true") { window.location.href = "/admin"; return; }
    supabase.from("site_settings").select("*").limit(1).single().then(({ data }: any) => {
      if (data) setSettings(data);
    });
  }, []);

  const handleSave = () => { saveSettings(settings as any); setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const fields = [
    { l: lang === "zh" ? "网站 Logo" : "Site Logo", k: "logo_url", image: true },
    { l: t("settings_site_name", lang), k: "site_name" },
    { l: lang === "zh" ? "网站名称（英文）" : "Site Name (EN)", k: "site_name_en" },
    { l: t("settings_phone", lang), k: "phone" },
    { l: t("settings_email", lang), k: "email" },
    { l: t("settings_address", lang), k: "address" },
    { l: lang === "zh" ? "地址（英文）" : "Address (EN)", k: "address_en" },
    { l: t("settings_hours", lang), k: "working_hours" },
    { l: lang === "zh" ? "工作时间（英文）" : "Working Hours (EN)", k: "working_hours_en" },
    { l: t("settings_facebook", lang), k: "facebook_url" },
    { l: t("settings_twitter", lang), k: "twitter_url" },
    { l: t("settings_instagram", lang), k: "instagram_url" },
    { l: t("settings_youtube", lang), k: "youtube_url" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{t("settings_title", lang)}</h1>
        <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors">
          {saved ? <><i className="fas fa-check mr-1"></i>{t("settings_saved", lang)}</> : <><i className="fas fa-save mr-1"></i>{t("settings_save", lang)}</>}
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((f) => (
            <div key={f.k}>
              {(f as any).image ? (
                <ImageUploader value={(settings as any)[f.k] || ""} onChange={(url) => setSettings({ ...settings, [f.k]: url })} label={f.l} />
              ) : (f as any).textarea ? (
                <>
                  <label className="block text-sm font-medium text-gray-600 mb-1">{f.l}</label>
                  <textarea value={(settings as any)[f.k] || ""} onChange={(e) => setSettings({ ...settings, [f.k]: e.target.value })} rows={6} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 outline-none" />
                </>
              ) : (
                <>
                  <label className="block text-sm font-medium text-gray-600 mb-1">{f.l}</label>
                  <input type="text" value={(settings as any)[f.k] || ""} onChange={(e) => setSettings({ ...settings, [f.k]: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 outline-none" />
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
