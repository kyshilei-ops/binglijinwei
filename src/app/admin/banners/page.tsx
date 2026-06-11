"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/lib/LanguageContext";
import { saveBanner, deleteBanner } from "@/lib/supabaseData";
import { t } from "@/lib/i18n";

interface BannerItem { id: number; title: string; subtitle: string; highlight: string; description: string; image_url: string; button1_label: string; button2_label: string; is_active: boolean; sort_order: number; }
const defaults: BannerItem[] = [
  { id: 1, title: "让您的草坪", subtitle: "专业草坪护理", highlight: "全年美丽如新", description: "为住宅和商业物业提供专业的割草和园艺护理服务。", image_url: "/images/banners/Banner-1.jpg", button1_label: "立即选购", button2_label: "联系我们", is_active: true, sort_order: 1 },
  { id: 2, title: "强劲设备助力", subtitle: "优质园艺工具", highlight: "您的花园", description: "为专业人士和家庭用户提供顶级割草机、打草机和园艺工具。", image_url: "/images/banners/banner-2.jpg", button1_label: "查看产品", button2_label: "了解更多", is_active: true, sort_order: 2 },
  { id: 3, title: "我们精心呵护", subtitle: "专家服务", highlight: "您的户外空间", description: "可靠、实惠、专业的草坪维护服务，值得您信赖。", image_url: "/images/banners/banner-3.jpg", button1_label: "立即开始", button2_label: "我们的服务", is_active: true, sort_order: 3 },
];

export default function BannersPage() {
  const { lang } = useLang();
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [editing, setEditing] = useState<BannerItem | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") !== "true") { window.location.href = "/admin"; return; }
    setBanners(JSON.parse(localStorage.getItem("cms_banners") || "null") || defaults);
  }, []);

  const save = (b: BannerItem) => {
    const u = editing && editing.id !== 0 ? banners.map((i) => (i.id === b.id ? b : i)) : [...banners, { ...b, id: Date.now(), is_active: true, sort_order: banners.length + 1 }];
    setBanners(u); setEditing(null);
  };
  const toggle = (id: number) => {
    const u = banners.map((b) => (b.id === id ? { ...b, is_active: !b.is_active } : b));
    setBanners(u);
  };
  const remove = (id: number) => {
    const u = banners.filter((b) => b.id !== id); setBanners(u);
  };

  if (!banners.length) return null;

  const fields = [
    { label: t("admin_title_field", lang), key: "title" },
    { label: t("ban_subtitle", lang), key: "subtitle" },
    { label: t("ban_highlight", lang), key: "highlight" },
    { label: t("ban_description", lang), key: "description" },
    { label: t("admin_image_url", lang), key: "image_url" },
    { label: t("ban_btn1_label", lang), key: "button1_label" },
    { label: t("ban_btn2_label", lang), key: "button2_label" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{t("ban_title", lang)}</h1>
        <button onClick={() => setEditing({ id: 0, title: "", subtitle: "", highlight: "", description: "", image_url: "", button1_label: "立即选购", button2_label: "联系我们", is_active: true, sort_order: 0 })} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
          <i className="fas fa-plus mr-2"></i>{t("ban_add", lang)}
        </button>
      </div>
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-auto">
            <h2 className="text-lg font-semibold mb-4">{editing.id ? t("ban_edit", lang) : t("ban_add", lang)}</h2>
            <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); save(editing); }}>
              {fields.map((f) => (
                <div key={f.key}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
                  <input type="text" value={(editing as any)[f.key] || ""} onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 outline-none" />
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md text-sm font-medium">{t("admin_save", lang)}</button>
                <button type="button" onClick={() => setEditing(null)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-md text-sm font-medium">{t("admin_cancel", lang)}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">{t("admin_order", lang)}</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">{t("admin_title_field", lang)}</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">{t("admin_image", lang)}</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">{t("admin_status", lang)}</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">{t("admin_actions", lang)}</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((b) => (
              <tr key={b.id} className="border-t border-gray-100">
                <td className="px-4 py-3">{b.sort_order}</td>
                <td className="px-4 py-3 font-medium text-gray-800">{b.title}</td>
                <td className="px-4 py-3 text-xs text-gray-400 truncate max-w-[200px]">{b.image_url}</td>
                <td className="px-4 py-3"><button onClick={() => toggle(b.id)} className={`text-xs px-2 py-1 rounded ${b.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>{b.is_active ? t("admin_active", lang) : t("admin_inactive", lang)}</button></td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setEditing(b)} className="text-blue-500 hover:text-blue-700 mr-3"><i className="fas fa-edit"></i></button>
                  <button onClick={() => remove(b.id)} className="text-red-500 hover:text-red-700"><i className="fas fa-trash"></i></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
