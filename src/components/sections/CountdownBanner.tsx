"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";

interface CountdownTime { days: number; hours: number; minutes: number; seconds: number; }

function calcTimeLeft(): CountdownTime {
  const target = new Date();
  target.setDate(target.getDate() + 15);
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return { days: Math.floor(diff / (1000 * 60 * 60 * 24)), hours: Math.floor((diff / (1000 * 60 * 60)) % 24), minutes: Math.floor((diff / (1000 * 60)) % 60), seconds: Math.floor((diff / 1000) % 60) };
}

export function CountdownBanner() {
  const { lang } = useLang();
  const [timeLeft, setTimeLeft] = useState<CountdownTime>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); setTimeLeft(calcTimeLeft()); const timer = setInterval(() => setTimeLeft(calcTimeLeft()), 1000); return () => clearInterval(timer); }, []);
  if (!mounted) return null;

  const boxes = [
    { label: t("countdown_days", lang), value: timeLeft.days },
    { label: t("countdown_hours", lang), value: timeLeft.hours },
    { label: t("countdown_mins", lang), value: timeLeft.minutes },
    { label: t("countdown_secs", lang), value: timeLeft.seconds },
  ];

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a202c] to-[#2d3748]" />
      <Image src="/images/banners/shop-banner.jpg" alt="" fill className="object-cover opacity-20" />
      <div className="container relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          <div>
            <p className="text-[#4caf50] font-medium text-lg mb-2 uppercase tracking-wide">{t("countdown_subtitle", lang)}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t("countdown_title", lang)} <span className="text-[#4caf50]">{t("countdown_highlight", lang)}</span></h2>
            <p className="text-gray-300 text-lg mb-6 max-w-md">{t("countdown_desc", lang)}</p>
            <Link href="#" className="inline-flex items-center px-8 py-3 bg-[#4caf50] hover:bg-[#388e3c] text-white font-medium rounded-md transition-colors">{t("countdown_btn", lang)} <i className="fas fa-arrow-right ml-2"></i></Link>
          </div>
          <div className="flex gap-4">
            {boxes.map((box) => (
              <div key={box.label} className="text-center">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-white/10 backdrop-blur rounded-lg flex flex-col items-center justify-center border border-white/20">
                  <span className="text-2xl md:text-3xl font-bold text-white">{String(box.value).padStart(2, "0")}</span>
                  <span className="text-xs text-gray-300 mt-1">{box.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
