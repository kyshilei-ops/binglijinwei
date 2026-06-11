"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/lib/LanguageContext";
import { saveBrand, deleteBrand } from "@/lib/supabaseData";
import { t } from "@/lib/i18n";

interface BItem { id: number; name: string; image_url: string; }
const defaults: BItem[] = [
  { id: 1, name: "Brand 1", image_url: "/images/brands/b-1.png" }, { id: 2, name: "Brand 2", image_url: "/images/brands/b-2.png" },
  { id: 3, name: "Brand 3", image_url: "/images/brands/b-3.png" }, { id: 4, name: "Brand 4", image_url: "/images/brands/b-4.png" },
  { id: 5, name: "Brand 5", image_url: "/images/brands/b-5.png" }, { id: 6, name: "Brand 6", image_url: "/images/brands/b-6.png" },
];

export default function BrandsPage() {
  const { lang } = useLang();
  const [items, setItems] = useState<BItem[]>([]);
  const [editing, setEditing] = useState<BItem | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") !== "true") { window.location.href = "/admin"; return; }
    setItems(JSON.parse(localStorage.getItem("cms_brands") || "null") || defaults);
  }, []);

  const save = (b: BItem) => {
    const u = editing && editing.id !== 0 ? items.map((i) => (i.id === b.id ? b : i)) : [...items, { ...b, id: Date.now() }];
    setItems(u); saveBrand(b); setEditing(null);
  };

  if (!items.length) return null;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{t("brand_title", lang)}</h1>
        <button onClick={() => setEditing({ id: 0, name: "", image_url: "" })} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
          <i className="fas fa-plus mr-2"></i>{t("brand_add", lang)}
        </button>
      </div>
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">{(editing.id ? t("admin_edit", lang) : t("brand_add", lang))} {t("sidebar_brands", lang)}</h2>
            <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); save(editing); }}>
              <div><label className="block text-xs font-medium text-gray-600 mb-1">{t("admin_name", lang)}</label><input type="text" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 outline-none" /></div>
              <div><label className="block text-xs font-medium text-gray-600 mb-1">{t("admin_image_url", lang)}</label><input type="text" value={editing.image_url} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 outline-none" /></div>
              <div className="flex gap-2 pt-2"><button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md text-sm font-medium">{t("admin_save", lang)}</button><button type="button" onClick={() => setEditing(null)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-md text-sm font-medium">{t("admin_cancel", lang)}</button></div>
            </form>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((b) => (
          <div key={b.id} className="bg-white rounded-lg shadow-sm p-4 text-center group">
            <div className="h-20 flex items-center justify-center mb-2"><img src={b.image_url} alt={b.name} className="max-h-full max-w-full object-contain" /></div>
            <p className="text-sm font-medium text-gray-800">{b.name}</p>
            <div className="flex justify-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => setEditing(b)} className="text-blue-500 hover:text-blue-700 text-xs"><i className="fas fa-edit"></i></button>
              <button onClick={() => { const u = items.filter((i) => i.id !== b.id); setItems(u); deleteBrand(b.id); }} className="text-red-500 hover:text-red-700 text-xs"><i className="fas fa-trash"></i></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
