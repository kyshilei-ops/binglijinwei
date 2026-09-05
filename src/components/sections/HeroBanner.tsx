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
    return <div className="w-full" style={{ height: "clamp(380px, 36.46vw, 700px)", backgroundColor: "#102e19" }} aria-hidden="true" />;
  }

  return (
    <section className="relative">
      <Swiper
        modules={[Autoplay, Navigation, Pagination, EffectFade]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        navigation
        pagination={{ clickable: true }}
        effect="fade"
        autoHeight
        loop={banners.length > 1}
        className="hero-banner w-full"
      >
        {banners.map((slide, i) => (
          <SwiperSlide key={slide.id}>
            <div className="relative flex flex-col">
              <div className="relative w-full shrink-0" style={{ aspectRatio: "1920 / 700", backgroundColor: "#102e19" }}>
                <ResolvedImage src={slide.image_url} alt="" fill priority={i === 0} sizes="100vw" quality={85} className="object-contain" />
              </div>
              <div className="hero-banner-content relative flex items-center">
                <div className="container w-full px-5 sm:px-8 lg:px-4">
                  <div className="max-w-[1100px] mx-auto text-center">
                    <p className="font-medium mb-2 sm:mb-3 uppercase tracking-wide" style={{ color: "#9cc211", fontSize: "clamp(0.75rem, 1.25vw, 1.125rem)" }}>{lang === "zh" ? slide.subtitle : (slide.subtitle_en || slide.subtitle)}</p>
                    <h1 className="font-bold text-white mb-3 leading-tight" style={{ fontSize: "clamp(1.4rem, 2.2vw, 2rem)" }}>
                      {lang === "zh" ? slide.title : (slide.title_en || slide.title)} <span style={{ color: "#9cc211" }}>{lang === "zh" ? slide.highlight : (slide.highlight_en || slide.highlight)}</span>
                    </h1>
                    <p className="text-gray-200 mb-5 leading-relaxed mx-auto max-w-[820px]" style={{ fontSize: "clamp(0.875rem, 1.35vw, 1.125rem)" }}>{lang === "zh" ? slide.description : (slide.description_en || slide.description)}</p>
                    <div className="flex flex-wrap justify-center gap-2.5 sm:gap-4">
                      <Link href="/products" className="inline-flex items-center justify-center px-5 py-2.5 sm:px-8 sm:py-3 text-white font-medium rounded-md transition-colors" style={{ backgroundColor: "#9cc211", fontSize: "clamp(0.875rem, 1.1vw, 1rem)" }}>
                        {lang === "zh" ? "查看产品" : "View Products"}
                      </Link>
                      <Link href="/contact" className="inline-flex items-center justify-center px-5 py-2.5 sm:px-8 sm:py-3 border-2 border-white text-white hover:bg-white font-medium rounded-md transition-colors" style={{ borderColor: "white", fontSize: "clamp(0.875rem, 1.1vw, 1rem)" }}>
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
