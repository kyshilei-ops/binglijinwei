"use client";

import { useEffect, useMemo, useState } from "react";
import { useLang } from "@/lib/LanguageContext";
import { deleteBlog, saveBlog, type BlogRow, useCmsBlogAll } from "@/lib/supabaseData";
import { decodeLocalizedField, encodeLocalizedField } from "@/lib/localizedFields";
import { SingleImageUploader } from "@/components/ui/SingleImageUploader";
import { t } from "@/lib/i18n";

interface BlogItem {
  id: number;
  title: string;
  title_en: string;
  excerpt: string;
  excerpt_en: string;
  content: string;
  content_en: string;
  image_url: string;
  category: string;
  category_en: string;
  author: string;
  author_en: string;
  published_at: string;
}

function emptyPost(): BlogItem {
  return {
    id: 0, title: "", title_en: "", excerpt: "", excerpt_en: "", content: "", content_en: "",
    image_url: "", category: "", category_en: "", author: "秉立锦为", author_en: "Binglijinwei", published_at: "",
  };
}

function toBlogItem(row: BlogRow): BlogItem {
  const content = decodeLocalizedField(row.content);
  const author = decodeLocalizedField(row.author);
  return {
    ...row,
    content: content.zh,
    content_en: content.en,
    author: author.zh,
    author_en: author.en,
  };
}

function toBlogRow(item: BlogItem): Partial<BlogRow> {
  const row: Partial<BlogRow> = {
    title: item.title,
    title_en: item.title_en,
    excerpt: item.excerpt,
    excerpt_en: item.excerpt_en,
    content: encodeLocalizedField(item.content, item.content_en),
    image_url: item.image_url,
    category: item.category,
    category_en: item.category_en,
    author: encodeLocalizedField(item.author, item.author_en),
    published_at: item.published_at || new Date().toISOString().slice(0, 10),
  };
  if (item.id) row.id = item.id;
  return row;
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <div><label className="block text-xs font-medium text-gray-600 mb-1">{label}</label><input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 outline-none" /></div>;
}

function TextArea({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (value: string) => void; rows?: number }) {
  return <div><label className="block text-xs font-medium text-gray-600 mb-1">{label}</label><textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 outline-none leading-relaxed" /></div>;
}

export default function BlogPage() {
  const { lang } = useLang();
  const { data: rows, setData: setRows, loading } = useCmsBlogAll();
  const [editing, setEditing] = useState<BlogItem | null>(null);
  const posts = useMemo(() => rows.map(toBlogItem).sort((a, b) => b.published_at.localeCompare(a.published_at)), [rows]);
  const isZh = lang === "zh";

  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") !== "true") window.location.href = "/admin";
  }, []);

  const update = (key: keyof BlogItem, value: string) => setEditing((current) => current ? { ...current, [key]: value } : current);

  const save = async (post: BlogItem) => {
    try {
      const { data, error } = await saveBlog(toBlogRow(post));
      if (error) throw error;
      const saved = data?.[0] as BlogRow | undefined;
      if (saved) setRows((current) => current.some((item) => item.id === saved.id) ? current.map((item) => item.id === saved.id ? saved : item) : [...current, saved]);
      setEditing(null);
    } catch (error) {
      console.error("Save blog post failed:", error);
      alert(isZh ? "保存失败，请重试。" : "Could not save the post. Please try again.");
    }
  };

  const remove = async (id: number) => {
    if (!window.confirm(isZh ? "确定删除这篇文章吗？" : "Delete this post?")) return;
    const { error } = await deleteBlog(id);
    if (error) { alert(isZh ? "删除失败，请重试。" : "Could not delete the post. Please try again."); return; }
    setRows((current) => current.filter((post) => post.id !== id));
  };

  if (loading) return <div className="py-16 text-center text-gray-400">{isZh ? "正在读取文章…" : "Loading posts…"}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{t("admin_blog_title", lang)}</h1>
        <button onClick={() => setEditing(emptyPost())} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"><i className="fas fa-plus mr-2"></i>{t("blog_add", lang)}</button>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-auto">
            <h2 className="text-lg font-semibold mb-5">{editing.id ? t("blog_edit", lang) : t("blog_add", lang)}{isZh ? "文章" : " post"}</h2>
            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); save(editing); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label={isZh ? "中文标题" : "Chinese title"} value={editing.title} onChange={(value) => update("title", value)} />
                <Field label={isZh ? "英文标题" : "English title"} value={editing.title_en} onChange={(value) => update("title_en", value)} />
                <Field label={isZh ? "中文分类" : "Chinese category"} value={editing.category} onChange={(value) => update("category", value)} />
                <Field label={isZh ? "英文分类" : "English category"} value={editing.category_en} onChange={(value) => update("category_en", value)} />
                <Field label={isZh ? "中文作者" : "Chinese author"} value={editing.author} onChange={(value) => update("author", value)} />
                <Field label={isZh ? "英文作者" : "English author"} value={editing.author_en} onChange={(value) => update("author_en", value)} />
              </div>

              <SingleImageUploader value={editing.image_url} onChange={(value) => update("image_url", value)} label={isZh ? "文章封面图" : "Cover image"} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <TextArea label={isZh ? "中文摘要" : "Chinese excerpt"} value={editing.excerpt} onChange={(value) => update("excerpt", value)} />
                <TextArea label={isZh ? "英文摘要" : "English excerpt"} value={editing.excerpt_en} onChange={(value) => update("excerpt_en", value)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <TextArea label={isZh ? "中文正文（可使用 HTML）" : "Chinese content (HTML supported)"} value={editing.content} onChange={(value) => update("content", value)} rows={12} />
                <TextArea label={isZh ? "英文正文（可使用 HTML）" : "English content (HTML supported)"} value={editing.content_en} onChange={(value) => update("content_en", value)} rows={12} />
              </div>

              <div className="flex gap-2 pt-1"><button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md text-sm font-medium">{t("admin_save", lang)}</button><button type="button" onClick={() => setEditing(null)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-md text-sm font-medium">{t("admin_cancel", lang)}</button></div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm"><thead className="bg-gray-50"><tr><th className="text-left px-4 py-3 font-medium text-gray-600">{t("admin_title_field", lang)}</th><th className="text-left px-4 py-3 font-medium text-gray-600">{t("prod_category", lang)}</th><th className="text-left px-4 py-3 font-medium text-gray-600">{t("blog_date", lang)}</th><th className="text-right px-4 py-3 font-medium text-gray-600">{t("admin_actions", lang)}</th></tr></thead>
          <tbody>{posts.map((post) => (<tr key={post.id} className="border-t border-gray-100"><td className="px-4 py-3 font-medium text-gray-800">{isZh ? post.title : (post.title_en || post.title)}</td><td className="px-4 py-3 text-gray-500">{isZh ? post.category : (post.category_en || post.category)}</td><td className="px-4 py-3 text-gray-500">{post.published_at}</td><td className="px-4 py-3 text-right"><button onClick={() => setEditing(post)} className="text-blue-500 hover:text-blue-700 mr-3" aria-label={isZh ? "编辑" : "Edit"}><i className="fas fa-edit"></i></button><button onClick={() => remove(post.id)} className="text-red-500 hover:text-red-700" aria-label={isZh ? "删除" : "Delete"}><i className="fas fa-trash"></i></button></td></tr>))}</tbody>
        </table>
        {posts.length === 0 && <p className="py-10 text-center text-gray-400">{isZh ? "还没有文章。" : "No posts yet."}</p>}
      </div>
    </div>
  );
}
