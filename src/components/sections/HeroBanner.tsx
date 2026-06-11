"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { ResolvedImage } from "@/components/ui/ResolvedImage";
import Link from "next/link";
import { useLang } from "@/lib/LanguageContext";
import { useCmsBanners } from "@/lib/supabaseData";

export function HeroBanner() {
  const { lang } = useLang();
  const banners = useCmsBanners();

  if (!banners.length) {
    return <div className="w-full h-[500px] md:h-[600px] bg-gray-200 flex items-center justify-center text-gray-400">No active banners</div>;
  }

  return (
    <section className="relative">
      <Swiper
        modules={[Autoplay, Navigation, Pagination, EffectFade]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        navigation
        pagination={{ clickable: true }}
        effect="fade"
        loop
        className="w-full h-[500px] md:h-[600px]"
      >
        {banners.map((slide, i) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full">
              <ResolvedImage src={slide.image_url} alt={slide.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex items-center">
                <div className="container">
                  <div className="max-w-xl">
                    <p className="font-medium text-lg mb-3 uppercase tracking-wide" style={{ color: "#9cc211" }}>{lang === "zh" ? slide.subtitle : (slide.subtitle_en || slide.subtitle)}</p>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                      {lang === "zh" ? slide.title : (slide.title_en || slide.title)} <span style={{ color: "#9cc211" }}>{lang === "zh" ? slide.highlight : (slide.highlight_en || slide.highlight)}</span>
                    </h1>
                    <p className="text-gray-200 text-lg mb-8 leading-relaxed">{lang === "zh" ? slide.description : (slide.description_en || slide.description)}</p>
                    <div className="flex gap-4">
                      <Link href="/products" className="inline-flex items-center px-8 py-3 text-white font-medium rounded-md transition-colors" style={{ backgroundColor: "#9cc211" }}>
                        {lang === "zh" ? "查看产品" : "View Products"}
                      </Link>
                      <Link href="/contact" className="inline-flex items-center px-8 py-3 border-2 border-white text-white hover:bg-white font-medium rounded-md transition-colors" style={{ borderColor: "white" }}>
                        {lang === "zh" ? "联系我们" : "Contact Us"}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
