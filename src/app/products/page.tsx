"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useCmsProducts } from "@/lib/supabaseData";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";
import { ResolvedImage } from "@/components/ui/ResolvedImage";
import { LocalizedPageMetadata } from "@/components/ui/LocalizedPageMetadata";
import { localizedProductBadge, localizedProductCategory } from "@/lib/contentLocalization";
import Link from "next/link";

function ProductGrid() {
  const { lang } = useLang();
  const products = useCmsProducts();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  // Dynamic categories from product data (bilingual)
  const categoryPairs = useMemo(() => {
    const categories = new Map<string, string>();
    products.forEach((product) => {
      if (product.category) categories.set(product.category, localizedProductCategory(product.category, product.category_en, lang));
    });
    return [...categories.entries()];
  }, [products, lang]);

  const selectedCategory = categoryPairs.find(([key, display]) => key === category || display === category);
  const categoryKey = selectedCategory?.[0] || category;
  const categoryLabel = selectedCategory?.[1] || category;
  const filteredProducts = categoryKey
    ? products.filter((p) => p.category === categoryKey)
    : products;

  return (
    <>
      <Header />
      <LocalizedPageMetadata
        titleZh={categoryLabel || "产品中心"}
        titleEn={categoryLabel || "Products"}
        descriptionZh="浏览秉立锦为的微耕机、汽油机水泵及其他小型农业机械。"
        descriptionEn="Explore Binglijinwei micro tillers, gasoline water pumps and compact agricultural equipment."
      />
      <main className="flex-1">
        <section className="py-16 bg-gradient-to-r from-[#1a202c] to-[#2d3748] text-center">
          <h1 className="text-4xl font-bold text-white">{categoryLabel || t("nav_products", lang)}</h1>
          <p className="text-gray-300 mt-3">{categoryKey ? `${filteredProducts.length} ${lang === "zh" ? "件产品" : "products"}` : t("products_title", lang)}</p>
        </section>

        <section className="py-16 bg-white">
          <div className="container">
            {/* Category tabs - dynamic from product data */}
            <div className="flex justify-center gap-4 mb-10 flex-wrap">
              <Link
                href="/products"
                className={`text-sm font-medium pb-2 border-b-2 transition-colors ${!categoryKey ? "text-[#4caf50] border-[#4caf50]" : "text-[#4a5568] border-transparent hover:text-[#4caf50]"}`}
              >
                {lang === "zh" ? "全部" : "All"}
              </Link>
              {categoryPairs.map(([key, display]) => (
                <Link
                  key={key}
                  href={`/products?category=${encodeURIComponent(key)}`}
                  className={`text-sm font-medium pb-2 border-b-2 transition-colors ${key === categoryKey ? "text-[#4caf50] border-[#4caf50]" : "text-[#4a5568] border-transparent hover:text-[#4caf50]"}`}
                >
                  {display}
                </Link>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((p) => (
                <Link key={p.id} href={`/products/${p.id}`} className="group bg-white border border-[#e5e5e5] rounded-lg overflow-hidden hover:shadow-lg transition-all">
                  <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    <ResolvedImage src={p.image_url} alt={lang === "zh" ? p.name : (p.name_en || p.name)} fill sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw" className="object-contain group-hover:scale-105 transition-transform duration-300" />
                    {localizedProductBadge(p.badge, lang) && (
                      <span className="absolute top-3 left-3 text-xs font-medium text-white px-2 py-1 rounded bg-[#4caf50]">{localizedProductBadge(p.badge, lang)}</span>
                    )}
                  </div>
                  <div className="p-5">
                    <span className="text-xs text-gray-400">{localizedProductCategory(p.category, p.category_en, lang)}</span>
                    <h3 className="text-sm font-medium text-[#1a202c] mt-1 mb-2 group-hover:text-[#4caf50] transition-colors">{lang === "zh" ? p.name : (p.name_en || p.name)}</h3>
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
