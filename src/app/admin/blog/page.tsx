"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/lib/LanguageContext";
import { saveBlog, deleteBlog } from "@/lib/supabaseData";
import { t } from "@/lib/i18n";

interface BlogItem { id: number; title: string; excerpt: string; content: string; image_url: string; category: string; author: string; published_at: string; }
const defaults: BlogItem[] = [
  { id: 1, title: "夏季如何养护草坪", excerpt: "夏季高温对草坪来说是个考验。了解最佳的浇水和修剪技巧，保持草坪翠绿。", content: "", image_url: "/images/blog/blog-13.jpg", category: "草坪护理", author: "管理员", published_at: "2024-06-15" },
  { id: 2, title: "每个家庭必备的10大园艺工具", excerpt: "无论您是初学者还是经验丰富的园丁，这些必备工具都能让您的工作更轻松。", content: "", image_url: "/images/blog/blog-14.jpg", category: "工具", author: "管理员", published_at: "2024-05-28" },
  { id: 3, title: "如何为您的院子选择合适的割草机", excerpt: "了解哪种类型最适合您的草坪大小和地形。", content: "", image_url: "/images/blog/blog-15.jpg", category: "设备", author: "管理员", published_at: "2024-04-12" },
];

export default function BlogPage() {
  const { lang } = useLang();
  const [posts, setPosts] = useState<BlogItem[]>([]);
  const [editing, setEditing] = useState<BlogItem | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") !== "true") { window.location.href = "/admin"; return; }
    setPosts(JSON.parse(localStorage.getItem("cms_blog") || "null") || defaults);
  }, []);

  const save = (p: BlogItem) => {
    const u = editing && editing.id !== 0 ? posts.map((i) => (i.id === p.id ? p : i)) : [...posts, { ...p, id: Date.now(), published_at: new Date().toISOString().split("T")[0] }];
    setPosts(u); saveBlog(p); setEditing(null);
  };
  const remove = (id: number) => { const u = posts.filter((p) => p.id !== id); setPosts(u); deleteBlog(id); };

  if (!posts.length) return null;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{t("admin_blog_title", lang)}</h1>
        <button onClick={() => setEditing({ id: 0, title: "", excerpt: "", content: "", image_url: "", category: "", author: "管理员", published_at: "" })} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
          <i className="fas fa-plus mr-2"></i>{t("blog_add", lang)}
        </button>
      </div>
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-auto">
            <h2 className="text-lg font-semibold mb-4">{(editing.id ? t("blog_edit", lang) : t("blog_add", lang))} {t("sidebar_blog", lang)}</h2>
            <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); save(editing); }}>
              {[{ l: t("admin_title_field", lang), k: "title" }, { l: t("prod_category", lang), k: "category" }, { l: t("blog_author", lang), k: "author" }, { l: t("admin_image_url", lang), k: "image_url" }].map((f) => (
                <div key={f.k}><label className="block text-xs font-medium text-gray-600 mb-1">{f.l}</label><input type="text" value={(editing as any)[f.k]} onChange={(e) => setEditing({ ...editing, [f.k]: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 outline-none" /></div>
              ))}
              <div><label className="block text-xs font-medium text-gray-600 mb-1">{t("blog_excerpt", lang)}</label><textarea value={editing.excerpt} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 outline-none" /></div>
              <div><label className="block text-xs font-medium text-gray-600 mb-1">{t("blog_content", lang)}</label><textarea value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} rows={6} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 outline-none font-mono" /></div>
              <div className="flex gap-2 pt-2"><button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md text-sm font-medium">{t("admin_save", lang)}</button><button type="button" onClick={() => setEditing(null)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-md text-sm font-medium">{t("admin_cancel", lang)}</button></div>
            </form>
          </div>
        </div>
      )}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm"><thead className="bg-gray-50"><tr><th className="text-left px-4 py-3 font-medium text-gray-600">{t("admin_title_field", lang)}</th><th className="text-left px-4 py-3 font-medium text-gray-600">{t("prod_category", lang)}</th><th className="text-left px-4 py-3 font-medium text-gray-600">{t("blog_date", lang)}</th><th className="text-right px-4 py-3 font-medium text-gray-600">{t("admin_actions", lang)}</th></tr></thead>
          <tbody>{posts.map((p) => (<tr key={p.id} className="border-t border-gray-100"><td className="px-4 py-3 font-medium text-gray-800">{p.title}</td><td className="px-4 py-3 text-gray-500">{p.category}</td><td className="px-4 py-3 text-gray-500">{p.published_at}</td><td className="px-4 py-3 text-right"><button onClick={() => setEditing(p)} className="text-blue-500 hover:text-blue-700 mr-3"><i className="fas fa-edit"></i></button><button onClick={() => remove(p.id)} className="text-red-500 hover:text-red-700"><i className="fas fa-trash"></i></button></td></tr>))}</tbody></table>
      </div>
    </div>
  );
}
