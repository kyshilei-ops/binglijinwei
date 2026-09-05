"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/lib/LanguageContext";
import { saveBanner, deleteBanner } from "@/lib/supabaseData";
import { supabase } from "@/lib/supabase";
import { SingleImageUploader } from "@/components/ui/SingleImageUploader";
import { t } from "@/lib/i18n";

interface BannerItem { id: number; title: string; subtitle: string; highlight: string; description: string; image_url: string; button1_label: string; button2_label: string; is_active: boolean; sort_order: number; }

export default function BannersPage() {
  const { lang } = useLang();
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [editing, setEditing] = useState<BannerItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") !== "true") { window.location.href = "/admin"; return; }
    supabase.from("banners").select("*").order("sort_order").then(({ data, error }) => {
      if (error) setError(error.message);
      else setBanners(data || []);
      setLoading(false);
    });
  }, []);

  const save = async (b: BannerItem) => {
    if (saving || uploading) return;
    if (!b.image_url) { setError("请先上传横幅图片"); return; }
    setSaving(true); setError("");
    try {
      const { data } = await saveBanner(b as any);
      if (data && data[0]) {
        if (editing && editing.id !== 0) {
          setBanners((prev: any) => prev.map((i: any) => i.id === b.id ? data[0] : i));
        } else {
          setBanners((prev: any) => [...prev, data[0]]);
        }
      }
      setEditing(null);
    } catch (e) {
      console.error("Save failed:", e);
      setError(`保存失败：${(e as Error).message}`);
    } finally { setSaving(false); }
  };
  const toggle = async (id: number) => {
    if (saving) return;
    const updated = banners.map((x) => x.id === id ? { ...x, is_active: !x.is_active } : x);
    const banner = updated.find((x) => x.id === id);
    setSaving(true);
    try { if (banner) await saveBanner(banner); setBanners(updated); }
    catch (e) { setError(`保存失败：${(e as Error).message}`); }
    finally { setSaving(false); }
  };
  const remove = async (id: number) => {
    if (saving) return;
    if (!confirm("确定删除这张横幅吗？")) return;
    setSaving(true);
    try { await deleteBanner(id); setBanners(prev => prev.filter(x => x.id !== id)); }
    catch (e) { setError(`删除失败：${(e as Error).message}`); }
    finally { setSaving(false); }
  };

  if (loading) return <p>加载中…</p>;

  const fields = [
    { label: t("admin_title_field", lang), key: "title" },
    { label: t("ban_subtitle", lang), key: "subtitle" },
    { label: t("ban_highlight", lang), key: "highlight" },
    { label: t("ban_description", lang), key: "description" },
    { label: t("admin_image_url", lang), key: "image_url" },
    { label: "英文标题", key: "title_en" },
    { label: "英文副标题", key: "subtitle_en" },
    { label: "英文强调文字", key: "highlight_en" },
    { label: "英文描述", key: "description_en" },
  ];

  return (
    <div>
      {!editing && error && <p role="alert" className="text-red-600 mb-4">{error}</p>}
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
              {error && <p role="alert" className="text-red-600">{error}</p>}
              {fields.map((f) => (
                <div key={f.key}>
                  {f.key === "image_url" ? (
                    <SingleImageUploader
                      value={(editing as any).image_url || ""}
                      onChange={(url) => setEditing(current => current ? { ...current, image_url: url } : current)}
                      onUploadingChange={setUploading}
                      label={f.label}
                    />
                  ) : (
                    <>
                      <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
                      <input type="text" value={(editing as any)[f.key] || ""} onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 outline-none" />
                    </>
                  )}
                </div>
              ))}
              <p className="text-xs text-gray-500">图片建议 1920 × 700 像素，JPG、PNG 或 WebP，不超过 5MB。按钮固定为“查看产品”和“联系我们”。</p>
              <label className="block text-sm">排序（数字越小越靠前）<input type="number" value={editing.sort_order} onChange={e => setEditing({ ...editing, sort_order: Number(e.target.value) || 0 })} className="border rounded p-2 ml-2 w-24" /></label>
              <label className="flex gap-2 text-sm"><input type="checkbox" checked={editing.is_active} onChange={e => setEditing({ ...editing, is_active: e.target.checked })} />在首页显示</label>
              <div className="flex gap-2 pt-2">
                <button disabled={saving || uploading} type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md text-sm font-medium disabled:opacity-50">{uploading ? "图片上传中…" : saving ? "保存中…" : t("admin_save", lang)}</button>
                <button disabled={saving || uploading} type="button" onClick={() => setEditing(null)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-md text-sm font-medium">{t("admin_cancel", lang)}</button>
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
