"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import Image from "next/image";
import { safeImageUrl } from "@/lib/imageUrl";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";
import { useCmsTestimonials, useCmsBrands } from "@/lib/supabaseData";

export function TestimonialsSection() {
  const { lang } = useLang();
  const testimonials = useCmsTestimonials();

  return (
    <section className="py-20 bg-white">
      <div className="container">
        <div className="text-center mb-14">
          <p className="section-subtitle">{t("testi_subtitle", lang)}</p>
          <h2 className="section-title">{t("testi_title", lang)}</h2>
        </div>
        {testimonials.length > 0 ? (
          <Swiper modules={[Autoplay, Navigation]} autoplay={{ delay: 4000 }} navigation loop slidesPerView={1} breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }} spaceBetween={30} className="max-w-5xl">
            {testimonials.map((test) => (
              <SwiperSlide key={test.id}>
                <div className="bg-[#f7f7f7] rounded-lg p-8 text-center">
                  <Image src={safeImageUrl(test.image_url)} alt={test.name} width={80} height={80} className="rounded-full mx-auto mb-4 object-cover" />
                  <div className="flex justify-center gap-1 text-yellow-400 text-sm mb-4">
                    {Array.from({ length: test.rating || 5 }).map((_, i) => <i key={i} className="fas fa-star"></i>)}
                  </div>
                  <p className="text-sm text-[#4a5568] leading-relaxed mb-5 italic">&ldquo;{lang === "zh" ? test.text : (test.text_en || test.text)}&rdquo;</p>
                  <h4 className="font-semibold text-[#1a202c]">{lang === "zh" ? test.name : (test.name_en || test.name)}</h4>
                  <p className="text-xs text-[#4a5568]">{lang === "zh" ? test.role : (test.role_en || test.role)}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p className="text-center text-gray-400 py-10">No testimonials yet.</p>
        )}
      </div>
    </section>
  );
}

export function BrandsSection() {
  const { lang } = useLang();
  const brands = useCmsBrands();

  return (
    <section className="py-16 bg-[#f7f7f7]">
      <div className="container">
        <div className="text-center mb-10">
          <p className="section-subtitle">{t("brands_subtitle", lang)}</p>
          <h2 className="section-title">{t("brands_title", lang)}</h2>
        </div>
        {brands.length > 0 ? (
          <Swiper modules={[Autoplay]} autoplay={{ delay: 3000 }} loop slidesPerView={2} breakpoints={{ 640: { slidesPerView: 3 }, 1024: { slidesPerView: 6 } }} spaceBetween={30}>
            {brands.map((b) => (
              <SwiperSlide key={b.id}>
                <div className="flex items-center justify-center p-4 bg-white rounded-lg border border-[#e5e5e5] h-24">
                  <Image src={safeImageUrl(b.image_url)} alt={b.name} width={100} height={40} className="object-contain opacity-60 hover:opacity-100 transition-opacity" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p className="text-center text-gray-400 py-10">No brands yet.</p>
        )}
      </div>
    </section>
  );
}
