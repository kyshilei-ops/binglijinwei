"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useCmsProducts } from "@/lib/supabaseData";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";
import { ResolvedImage } from "@/components/ui/ResolvedImage";
import Link from "next/link";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { lang } = useLang();
  const products = useCmsProducts();
  const product = products.find((p) => p.id === Number(id));
  const [selectedImg, setSelectedImg] = useState(0);
  // Reset selected image when product changes
  useEffect(() => { setSelectedImg(0); }, [id]);

  if (!product) {
    return (
      <>
        <Header />
        <main className="flex-1 flex items-center justify-center py-40">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{t("prod_not_found", lang)}</h1>
            <Link href="/products" className="text-[#4caf50] hover:underline">{t("prod_back", lang)}</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Parse gallery images
  let galleryImages: string[] = [];
  try { galleryImages = JSON.parse((product as any).images || "[]"); } catch { galleryImages = []; }
  // Main image is the first gallery image or the single image_url
  const allImages = galleryImages.length > 0
    ? galleryImages
    : [product.image_url].filter(Boolean);
  // Bilingual display
  const pName = lang === "zh" ? product.name : ((product as any).name_en || product.name);
  const pCategory = lang === "zh" ? product.category : ((product as any).category_en || product.category);
  const pDesc = lang === "zh" ? (product.description || "") : ((product as any).description_en || product.description || "");
  const descLines = pDesc.split("\n").filter((l: string) => l.trim().length > 0);
  const hasDesc = descLines.length > 0;

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="py-12">
          <div className="container">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
              <Link href="/" className="hover:text-[#4caf50]">{t("nav_home", lang)}</Link>
              <span>/</span>
              <Link href="/products" className="hover:text-[#4caf50]">{t("nav_products", lang)}</Link>
              <span>/</span>
              <span className="text-gray-600">{pName}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Product Images */}
              <div>
                {/* Main image */}
                <div className="relative h-80 md:h-[400px] bg-gray-50 rounded-lg overflow-hidden mb-3">
                  <ResolvedImage src={allImages[selectedImg]} alt={pName} fill className="object-contain" />
                  {product.badge && (
                    <span className="absolute top-4 left-4 bg-red-500 text-white text-sm px-3 py-1 rounded">{product.badge}</span>
                  )}
                </div>

                {/* Thumbnails */}
                {allImages.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {allImages.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImg(i)}
                        className={`relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border-2 transition-colors ${
                          i === selectedImg ? "border-[#4caf50]" : "border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        <ResolvedImage src={img} alt={`${i + 1}`} fill className="object-contain" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div>
                <span className="text-sm text-gray-400">{pCategory}</span>
                <h1 className="text-3xl font-bold text-[#1a202c] mt-2 mb-4">{pName}</h1>
                {product.price > 0 && (
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl font-bold" style={{ color: "#9cc211" }}>${product.price.toFixed(2)}</span>
                    {product.old_price && (
                      <span className="text-xl text-gray-400 line-through">${product.old_price.toFixed(2)}</span>
                    )}
                  </div>
                )}

                {/* Inquiry button */}
                <div className="mb-8">
                  <Link href="/contact" className="inline-flex items-center px-8 py-3 bg-[#4caf50] hover:bg-[#388e3c] text-white font-medium rounded-md transition-colors">
                    <i className="fas fa-envelope mr-2"></i>{t("prod_inquiry", lang)}
                  </Link>
                </div>

                {/* Description - line by line */}
                <div className="border-t border-gray-200 pt-6 mb-6">
                  {hasDesc ? (
                    <div className="space-y-2">
                      {descLines.map((line: string, i: number) => (
                        <p key={i} className="text-[#4a5568] leading-relaxed flex items-start gap-2">
                          <span className="text-[#4caf50] mt-1 flex-shrink-0">•</span>
                          <span>{line.trim()}</span>
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#4a5568] leading-relaxed">{t("prod_no_desc", lang)}</p>
                  )}
                </div>

                {/* Meta info */}
                <div className="border-t border-gray-200 pt-6 space-y-2 text-sm text-[#4a5568]">
                  <p><strong>{t("prod_category_label", lang)}:</strong> {pCategory}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related products */}
        {products.filter((p) => p.category === product.category && p.id !== product.id).length > 0 && (
          <section className="py-16 bg-[#f7f7f7]">
            <div className="container">
              <h2 className="text-2xl font-bold text-[#1a202c] mb-8 text-center">{t("prod_related", lang)}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4).map((p) => (
                  <Link key={p.id} href={`/products/${p.id}`} className="group bg-white border border-[#e5e5e5] rounded-lg overflow-hidden hover:shadow-lg transition-all">
                    <div className="relative h-48 bg-gray-50 overflow-hidden">
                      <ResolvedImage src={p.image_url} alt={p.name} fill className="object-contain group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-[#1a202c] group-hover:text-[#4caf50] transition-colors">{p.name}</h3>
                      <span className="text-[#4caf50] font-semibold">${p.price.toFixed(2)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
