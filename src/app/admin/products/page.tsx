"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/lib/LanguageContext";
import { saveProduct, deleteProduct } from "@/lib/supabaseData";
import { MultiImageUploader } from "@/components/ui/MultiImageUploader";
import { saveImages } from "@/lib/imageStore";
import { t } from "@/lib/i18n";

interface ProductItem { id: number; name: string; name_en: string; price: number; old_price: number | null; image_url: string; images: string; category: string; category_en: string; badge: string; rating: number; description: string; description_en: string; specs: string; is_featured: boolean; }
const defaults: ProductItem[] = [
  { id: 1, name: "电动割草机 Pro", name_en: "Electric Lawn Mower Pro", price: 299, old_price: 399, image_url: "/images/products/p01.jpg", category: "割草机", category_en: "Lawn Mowers", badge: "促销", rating: 5, description: "", description_en: "", specs: "", images: "[]", is_featured: true },
  { id: 2, name: "汽油动力割草机 XL", name_en: "Gas Powered Mower XL", price: 459, old_price: null, image_url: "/images/products/p02.jpg", category: "割草机", category_en: "Lawn Mowers", badge: "", rating: 5, description: "", description_en: "", specs: "", images: "[]", is_featured: true },
  { id: 3, name: "智能割草机器人", name_en: "Robot Lawn Mower Smart", price: 899, old_price: 1199, image_url: "/images/products/p03.jpg", category: "割草机", category_en: "Lawn Mowers", badge: "热销", rating: 5, description: "", description_en: "", specs: "", images: "[]", is_featured: true },
  { id: 4, name: "无线打草机", name_en: "Cordless Grass Trimmer", price: 129, old_price: null, image_url: "/images/products/p04.jpg", category: "打草机", category_en: "Trimmers", badge: "", rating: 5, description: "", description_en: "", specs: "", images: "[]", is_featured: true },
  { id: 5, name: "专业吹叶机", name_en: "Professional Leaf Blower", price: 189, old_price: 249, image_url: "/images/products/p05.jpg", category: "吹叶机", category_en: "Blowers", badge: "促销", rating: 5, description: "", description_en: "", specs: "", images: "[]", is_featured: true },
  { id: 6, name: "园艺工具8件套", name_en: "Garden Tool Set 8-Piece", price: 79, old_price: null, image_url: "/images/products/p06.jpg", category: "配件", category_en: "Accessories", badge: "新品", rating: 5, description: "", description_en: "", specs: "", images: "[]", is_featured: true },
  { id: 7, name: "重型电锯", name_en: "Heavy Duty Chainsaw", price: 349, old_price: null, image_url: "/images/products/p07.jpg", category: "工具", category_en: "Tools", badge: "", rating: 5, description: "", description_en: "", specs: "", images: "[]", is_featured: true },
  { id: 8, name: "电动修枝剪", name_en: "Hedge Trimmer Electric", price: 99, old_price: 149, image_url: "/images/products/p08.jpg", category: "打草机", category_en: "Trimmers", badge: "促销", rating: 5, description: "", description_en: "", specs: "", images: "[]", is_featured: true },
];

export default function ProductsPage() {
  const { lang } = useLang();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [editing, setEditing] = useState<ProductItem | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") !== "true") { window.location.href = "/admin"; return; }
    setProducts(JSON.parse(localStorage.getItem("cms_products") || "null") || defaults);
  }, []);

  const save = async (p: ProductItem) => {
    // Move base64 images to IndexedDB before saving
    const galleryImages = JSON.parse(p.images || "[]");
    const savedImages = await saveImages(galleryImages);
    // Use first gallery image as main image_url
    const mainImage = savedImages.length > 0 ? savedImages[0] : "";
    const processed = { ...p, image_url: mainImage, images: JSON.stringify(savedImages) };
    const u = editing && editing.id !== 0 ? products.map((i) => (i.id === p.id ? processed : i)) : [...products, { ...processed, id: Date.now() }];
    setProducts(u); saveProduct(processed); setEditing(null);
  };
  const remove = (id: number) => {
    const u = products.filter((p) => p.id !== id); setProducts(u); 
  };

  if (!products.length) return null;

  const fields = [
    { label: t("prod_name", lang), key: "name" },
    { label: t("prod_price", lang), key: "price", type: "number" },
    { label: t("prod_old_price", lang), key: "old_price", type: "number" },
    { label: lang === "zh" ? "产品图片" : "Gallery", key: "images" },
    { label: t("prod_category", lang), key: "category" },
    { label: t("prod_badge", lang), key: "badge" },
    { label: lang === "zh" ? "产品描述" : "Description", key: "description", textarea: true },
    { label: lang === "zh" ? "英文名称" : "English Name", key: "name_en" },
    { label: lang === "zh" ? "英文分类" : "English Category", key: "category_en" },
    { label: lang === "zh" ? "英文描述" : "English Description", key: "description_en", textarea: true },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{t("prod_title", lang)}</h1>
        <button onClick={() => setEditing({ id: 0, name: "", name_en: "", price: 0, old_price: null, image_url: "", category: "", category_en: "", badge: "", rating: 5, description: "", description_en: "", specs: "", images: "[]", is_featured: false })} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
          <i className="fas fa-plus mr-2"></i>{t("prod_add", lang)}
        </button>
      </div>
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-auto">
            <h2 className="text-lg font-semibold mb-4">{(editing.id ? t("prod_edit", lang) : t("prod_add", lang))} {t("sidebar_products", lang)}</h2>
            <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); save(editing); }}>
              {fields.map((f) => (
                <div key={f.key}>
                  {f.key === "images" ? (
                    <MultiImageUploader
                      images={(() => { try { return JSON.parse((editing as any).images || "[]"); } catch { return []; } })()}
                      onChange={(imgs) => setEditing({ ...editing, images: JSON.stringify(imgs) })}
                      label={f.label}
                    />
                  ) : f.key === "description" || f.key === "description_en" ? (
                    <>
                      <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
                      <textarea
                        value={(editing as any)[f.key] || ""}
                        onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })}
                        rows={5}
                        placeholder={lang === "zh" ? "每行一条描述，前端会逐行显示" : "One line per item, displayed line by line"}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 outline-none"
                      />
                    </>
                  ) : (
                    <>
                      <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
                      <input type={f.type || "text"} value={(editing as any)[f.key] ?? ""} onChange={(e) => setEditing({ ...editing, [f.key]: f.type === "number" ? Number(e.target.value) || 0 : e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 outline-none" />
                    </>
                  )}
                </div>
              ))}
              <div className="flex gap-2 pt-2"><button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md text-sm font-medium">{t("admin_save", lang)}</button><button type="button" onClick={() => setEditing(null)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-md text-sm font-medium">{t("admin_cancel", lang)}</button></div>
            </form>
          </div>
        </div>
      )}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr><th className="text-left px-4 py-3 font-medium text-gray-600">{t("prod_name", lang)}</th><th className="text-left px-4 py-3 font-medium text-gray-600">{t("prod_price", lang)}</th><th className="text-left px-4 py-3 font-medium text-gray-600">{t("prod_category", lang)}</th><th className="text-left px-4 py-3 font-medium text-gray-600">{t("prod_badge", lang)}</th><th className="text-right px-4 py-3 font-medium text-gray-600">{t("admin_actions", lang)}</th></tr></thead>
          <tbody>{products.map((p) => (<tr key={p.id} className="border-t border-gray-100"><td className="px-4 py-3 font-medium text-gray-800">{p.name}</td><td className="px-4 py-3">${p.price}{p.old_price ? <span className="text-gray-400 line-through ml-2 text-xs">${p.old_price}</span> : ""}</td><td className="px-4 py-3 text-gray-500">{p.category}</td><td className="px-4 py-3">{p.badge ? <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">{p.badge}</span> : "-"}</td><td className="px-4 py-3 text-right"><button onClick={() => setEditing(p)} className="text-blue-500 hover:text-blue-700 mr-3"><i className="fas fa-edit"></i></button><button onClick={() => remove(p.id)} className="text-red-500 hover:text-red-700"><i className="fas fa-trash"></i></button></td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );
}
