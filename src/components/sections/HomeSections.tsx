"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ResolvedImage } from "@/components/ui/ResolvedImage";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";
import { useCmsProducts } from "@/lib/supabaseData";

function QualityIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3 19 6v5c0 5-3 8.2-7 10-4-1.8-7-5-7-10V6l7-3Z" /><path d="m8.8 12 2.1 2.1 4.4-4.4" /></svg>;
}

function ServiceIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 13v-1a8 8 0 0 1 16 0v1" /><path d="M5 13h2v5H5a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2ZM19 13h-2v5h2a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2Z" /><path d="M17 18c0 1.7-1.3 3-3 3h-2" /></svg>;
}

function InnovationIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18h6" /><path d="M10 22h4" /><path d="M8.7 15.3A7 7 0 1 1 15.3 15c-.9.7-1.3 1.7-1.3 2.7h-4c0-1-.4-1.8-1.3-2.4Z" /><path d="M12 2v1.2M4.9 5l.9.9M19.1 5l-.9.9" /></svg>;
}

function AfterSalesIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m14.7 6.3-8.4 8.4a2.3 2.3 0 0 0 3.3 3.3l8.4-8.4" /><path d="M15.4 3.4a4.5 4.5 0 0 0 5.2 5.2l-4.2 4.2-3.3-3.3 4.2-4.2a4.6 4.6 0 0 0-1.9-1.8Z" /><path d="m4.5 19.5 1.2 1.2" /></svg>;
}

export function ServiceFeatures() {
  const { lang } = useLang();
  const services = [
    { title: t("service_quality_title", lang), desc: t("service_quality_desc", lang), Icon: QualityIcon },
    { title: t("service_service_title", lang), desc: t("service_service_desc", lang), Icon: ServiceIcon },
    { title: t("service_innovation_title", lang), desc: t("service_innovation_desc", lang), Icon: InnovationIcon },
    { title: t("service_after_sales_title", lang), desc: t("service_after_sales_desc", lang), Icon: AfterSalesIcon },
  ];

  return (
    <section className="py-0 -mt-20 relative z-10">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((s, i) => (
            <div key={i} className="bg-white rounded-lg border border-[#e5e5e5] p-10 text-center hover:shadow-lg transition-shadow group">
              <div className="service-feature-icon w-14 h-14 mx-auto mb-5 rounded-full flex items-center justify-center transition-colors">
                <s.Icon />
              </div>
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
