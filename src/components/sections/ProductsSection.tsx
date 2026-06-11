"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ResolvedImage } from "@/components/ui/ResolvedImage";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";
import { useCmsProducts } from "@/lib/supabaseData";

function ProductCard({ product }: { product: { id: number; name: string; name_en: string; image_url: string; price: string; old_price: string | null; badge: string | null } }) {
  const { lang } = useLang();
  const displayName = lang === "zh" ? product.name : (product.name_en || product.name);
  const safePrice = (val: string) => {
    try {
      const n = parseFloat(val.replace("$", ""));
      return isNaN(n) ? "0.00" : n.toFixed(2);
    } catch { return "0.00"; }
  };
  return (
    <div className="group bg-white border border-[#e5e5e5] rounded-lg overflow-hidden hover:shadow-lg transition-all">
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <ResolvedImage src={product.image_url} alt={displayName || "Product"} fill className="object-contain group-hover:scale-105 transition-transform duration-300" />
        {product.badge && (
          <span className={`absolute top-3 left-3 text-xs font-medium text-white px-2 py-1 rounded ${product.badge === "Sale" ? "bg-red-500" : product.badge === "Hot" ? "bg-orange-500" : "bg-blue-500"}`}>{product.badge}</span>
        )}
        <div className="absolute inset-x-0 bottom-0 flex justify-center gap-2 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#4a5568] hover:bg-[#4caf50] hover:text-white shadow-md transition-colors" title={t("quick_view", lang)}><i className="far fa-eye"></i></button>
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#4a5568] hover:bg-[#4caf50] hover:text-white shadow-md transition-colors" title={t("add_to_wishlist", lang)}><i className="far fa-heart"></i></button>
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#4a5568] hover:bg-[#4caf50] hover:text-white shadow-md transition-colors" title={t("compare", lang)}><i className="fas fa-exchange-alt"></i></button>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-sm font-medium text-[#1a202c] mb-2 group-hover:text-[#4caf50] transition-colors line-clamp-2"><Link href={`/products/${product.id}`}>{displayName}</Link></h3>
        {product.price !== "$0.00" && (
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-[#9cc211]">{product.price}</span>
            {product.old_price && <span className="text-sm text-gray-400 line-through">{product.old_price}</span>}
          </div>
        )}
        <div className="flex items-center gap-0.5 mt-2 text-yellow-400 text-xs">
          {Array.from({ length: 5 }).map((_, i) => <i key={i} className="fas fa-star"></i>)}
        </div>
      </div>
    </div>
  );
}

export function ProductsSection() {
  const { lang } = useLang();
  const products = useCmsProducts();
  const [activeTab, setActiveTab] = useState(0);

  // Bilingual categories: zhKeys for filtering, display for showing
  const categoryPairs = useMemo(() => {
    const map = new Map<string, string>(); // zhKey -> displayName
    products.forEach((p) => {
      if (p.category) map.set(p.category, lang === "zh" ? p.category : ((p as any).category_en || p.category));
    });
    return [...map.entries()]; // [[zhKey, display], ...]
  }, [products, lang]);

  const tabs = [t("products_tab_all", lang), ...categoryPairs.map(([, d]) => d)];

  const filteredProducts = activeTab === 0
    ? products
    : products.filter((p) => p.category === categoryPairs[activeTab - 1]?.[0]);

  return (
    <section className="py-20 bg-[#f7f7f7]">
      <div className="container">
        <div className="text-center mb-14">
          <p className="section-subtitle">{t("products_subtitle", lang)}</p>
          <h2 className="section-title">{t("products_title", lang)}</h2>
        </div>
        <div className="flex justify-center gap-6 mb-10 flex-wrap">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`text-sm font-medium pb-2 border-b-2 transition-colors ${i === activeTab ? "text-[#4caf50] border-[#4caf50]" : "text-[#4a5568] border-transparent hover:text-[#4caf50]"}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={{
              id: p.id,
              name: p.name,
              name_en: (p as any).name_en || "",
              image_url: p.image_url,
              price: `$${p.price.toFixed(2)}`,
              old_price: p.old_price ? `$${p.old_price.toFixed(2)}` : null,
              badge: p.badge || null,
            }} />
          ))}
        </div>
        {filteredProducts.length === 0 && (
          <p className="text-center text-gray-400 py-10">{lang === "zh" ? "暂无产品" : "No products yet"}</p>
        )}
      </div>
    </section>
  );
}
