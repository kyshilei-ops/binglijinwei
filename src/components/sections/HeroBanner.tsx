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
    return <div className="w-full" style={{ aspectRatio: "1920 / 700", backgroundColor: "#102e19" }} aria-hidden="true" />;
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
              <div className="hero-banner-actions">
                      <Link href="/products" className="hero-banner-action hero-banner-action-primary">
                        {lang === "zh" ? "查看产品" : "View Products"}
                      </Link>
                      <Link href="/contact" className="hero-banner-action">
                        {lang === "zh" ? "联系我们" : "Contact Us"}
                      </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
