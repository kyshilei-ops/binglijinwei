"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useCmsProducts } from "@/lib/supabaseData";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";
import { ResolvedImage } from "@/components/ui/ResolvedImage";
import Link from "next/link";

function ProductGrid() {
  const { lang } = useLang();
  const products = useCmsProducts();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  // Dynamic categories from product data (bilingual)
  const categories = useMemo(() => {
    const cats = products.map((p) => lang === "zh" ? p.category : (p.category_en || p.category)).filter(Boolean);
    return [...new Set(cats)];
  }, [products, lang]);

  const filteredProducts = category
    ? products.filter((p) => p.category === category)
    : products;

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="py-16 bg-gradient-to-r from-[#1a202c] to-[#2d3748] text-center">
          <h1 className="text-4xl font-bold text-white">{category || t("nav_products", lang)}</h1>
          <p className="text-gray-300 mt-3">{category ? `${filteredProducts.length} ${lang === "zh" ? "件产品" : " products"}` : t("products_title", lang)}</p>
        </section>

        <section className="py-16 bg-white">
          <div className="container">
            {/* Category tabs - dynamic from product data */}
            <div className="flex justify-center gap-4 mb-10 flex-wrap">
              <Link
                href="/products"
                className={`text-sm font-medium pb-2 border-b-2 transition-colors ${!category ? "text-[#4caf50] border-[#4caf50]" : "text-[#4a5568] border-transparent hover:text-[#4caf50]"}`}
              >
                {lang === "zh" ? "全部" : "All"}
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/products?category=${encodeURIComponent(cat)}`}
                  className={`text-sm font-medium pb-2 border-b-2 transition-colors ${cat === category ? "text-[#4caf50] border-[#4caf50]" : "text-[#4a5568] border-transparent hover:text-[#4caf50]"}`}
                >
                  {cat}
                </Link>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((p) => (
                <Link key={p.id} href={`/products/${p.id}`} className="group bg-white border border-[#e5e5e5] rounded-lg overflow-hidden hover:shadow-lg transition-all">
                  <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    <ResolvedImage src={p.image_url} alt={p.name} fill className="object-contain group-hover:scale-105 transition-transform duration-300" />
                    {p.badge && (
                      <span className="absolute top-3 left-3 text-xs font-medium text-white px-2 py-1 rounded bg-red-500">{p.badge}</span>
                    )}
                  </div>
                  <div className="p-5">
                    <span className="text-xs text-gray-400">{lang === "zh" ? p.category : (p.category_en || p.category)}</span>
                    <h3 className="text-sm font-medium text-[#1a202c] mt-1 mb-2 group-hover:text-[#4caf50] transition-colors">{lang === "zh" ? p.name : ((p as any).name_en || p.name)}</h3>
                    {p.price > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold" style={{ color: "#9cc211" }}>${p.price.toFixed(2)}</span>
                        {p.old_price && <span className="text-sm text-gray-400 line-through">${p.old_price.toFixed(2)}</span>}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
            {filteredProducts.length === 0 && <p className="text-center text-gray-400 py-20">{lang === "zh" ? "暂无产品" : "No products yet"}</p>}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ProductGrid />
    </Suspense>
  );
}
