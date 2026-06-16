"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/lib/LanguageContext";
import { saveTestimonial, deleteTestimonial } from "@/lib/supabaseData";
import { supabase } from "@/lib/supabase";
import { t } from "@/lib/i18n";

interface TItem { id: number; name: string; role: string; text: string; image_url: string; rating: number; }
const defaults: TItem[] = [
  { id: 1, name: "张伟", role: "业主", text: "服务非常出色！强烈推荐！", image_url: "/images/testimonials/testi-01.jpg", rating: 5 },
  { id: 2, name: "李娜", role: "物业经理", text: "可靠、专业、准时。每次都做得很好！", image_url: "/images/testimonials/testi-02.jpg", rating: 5 },
  { id: 3, name: "王强", role: "景观设计师", text: "设备质量非常出色，从未让我失望！", image_url: "/images/testimonials/testi-03.jpg", rating: 5 },
];

export default function TestimonialsPage() {
  const { lang } = useLang();
  const [items, setItems] = useState<TItem[]>([]);
  const [editing, setEditing] = useState<TItem | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") !== "true") { window.location.href = "/admin"; return; }
    setItems([]);
  }, []);

  const save = (t: TItem) => {
    const u = editing && editing.id !== 0 ? items.map((i) => (i.id === t.id ? t : i)) : [...items, { ...t, id: Date.now() }];
    setItems(u); saveTestimonial(t).catch(console.error); setEditing(null);
  };

  if (!items.length) return null;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{t("test_title", lang)}</h1>
        <button onClick={() => setEditing({ id: 0, name: "", role: "", text: "", image_url: "", rating: 5 })} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
          <i className="fas fa-plus mr-2"></i>{t("test_add", lang)}
        </button>
      </div>
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-auto">
            <h2 className="text-lg font-semibold mb-4">{(editing.id ? t("test_edit", lang) : t("test_add", lang))} {t("sidebar_testimonials", lang)}</h2>
            <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); save(editing); }}>
              {[{ l: t("admin_name", lang), k: "name" }, { l: t("test_role", lang), k: "role" }, { l: t("admin_image_url", lang), k: "image_url" }].map((f) => (
                <div key={f.k}><label className="block text-xs font-medium text-gray-600 mb-1">{f.l}</label><input type="text" value={(editing as any)[f.k]} onChange={(e) => setEditing({ ...editing, [f.k]: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 outline-none" /></div>
              ))}
              <div><label className="block text-xs font-medium text-gray-600 mb-1">{t("test_text", lang)}</label><textarea value={editing.text} onChange={(e) => setEditing({ ...editing, text: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 outline-none" /></div>
              <div className="flex gap-2 pt-2"><button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md text-sm font-medium">{t("admin_save", lang)}</button><button type="button" onClick={() => setEditing(null)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-md text-sm font-medium">{t("admin_cancel", lang)}</button></div>
            </form>
          </div>
        </div>
      )}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm"><thead className="bg-gray-50"><tr><th className="text-left px-4 py-3 font-medium text-gray-600">{t("admin_name", lang)}</th><th className="text-left px-4 py-3 font-medium text-gray-600">{t("test_role", lang)}</th><th className="text-left px-4 py-3 font-medium text-gray-600">{t("test_text", lang)}</th><th className="text-right px-4 py-3 font-medium text-gray-600">{t("admin_actions", lang)}</th></tr></thead>
          <tbody>{items.map((t) => (<tr key={t.id} className="border-t border-gray-100"><td className="px-4 py-3 font-medium text-gray-800">{t.name}</td><td className="px-4 py-3 text-gray-500">{t.role}</td><td className="px-4 py-3 text-gray-500 max-w-[300px] truncate">{t.text}</td><td className="px-4 py-3 text-right"><button onClick={() => setEditing(t)} className="text-blue-500 hover:text-blue-700 mr-3"><i className="fas fa-edit"></i></button><button onClick={() => { const u = items.filter((i) => i.id !== t.id); setItems(u);  }} className="text-red-500 hover:text-red-700"><i className="fas fa-trash"></i></button></td></tr>))}</tbody></table>
      </div>
    </div>
  );
}
