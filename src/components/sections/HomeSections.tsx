"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ResolvedImage } from "@/components/ui/ResolvedImage";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";
import { useCmsProducts } from "@/lib/supabaseData";

const icons = ["🚚", "🛡️", "🎧", "🔄"];

export function ServiceFeatures() {
  const { lang } = useLang();
  const services = [
    { title: t("service_shipping_title", lang), desc: t("service_shipping_desc", lang) },
    { title: t("service_payment_title", lang), desc: t("service_payment_desc", lang) },
    { title: t("service_support_title", lang), desc: t("service_support_desc", lang) },
    { title: t("service_returns_title", lang), desc: t("service_returns_desc", lang) },
  ];

  return (
    <section className="py-0 -mt-20 relative z-10">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((s, i) => (
            <div key={i} className="bg-white rounded-lg border border-[#e5e5e5] p-10 text-center hover:shadow-lg transition-shadow group">
              <div className="text-4xl mb-5">{icons[i]}</div>
              <h3 className="text-lg font-semibold text-[#1a202c] mb-3 group-hover:text-[#4caf50] transition-colors">{s.title}</h3>
              <p className="text-sm text-[#4a5568] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CategoriesSection() {
  const { lang } = useLang();
  const products = useCmsProducts();

  const categories = useMemo(() => {
    const catMap = new Map<string, { count: number; image: string; nameZh: string; nameEn: string }>();
    products.forEach((p) => {
      if (!p.category) return;
      const existing = catMap.get(p.category);
      if (existing) {
        existing.count++;
      } else {
        catMap.set(p.category, {
          count: 1,
          image: p.image_url || "/images/misc/cms-1.jpg",
          nameZh: p.category,
          nameEn: (p as any).category_en || p.category,
        });
      }
    });
    return [...catMap.entries()].map(([key, data]) => ({
      key,
      name: lang === "zh" ? data.nameZh : (data.nameEn || data.nameZh),
      image: data.image,
      count: data.count,
    }));
  }, [products, lang]);

  // Fallback if no products
  if (categories.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="container">
        <div className="text-center mb-14">
          <p className="section-subtitle">{t("cat_subtitle", lang)}</p>
          <h2 className="section-title">{t("cat_title", lang)}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link key={cat.name} href={`/products?category=${encodeURIComponent(cat.name)}`} className="group relative rounded-lg overflow-hidden border border-[#e5e5e5] hover:shadow-lg transition-all">
              <div className="relative h-48">
                <ResolvedImage src={cat.image} alt={cat.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <h3 className="text-xl font-semibold mb-1">{cat.name}</h3>
                  <p className="text-sm opacity-80">{cat.count} {t("cat_products", lang)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
