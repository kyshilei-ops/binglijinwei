"use client";

import Link from "next/link";
import Image from "next/image";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";
import { useCmsSettings } from "@/lib/supabaseData";

const CNAME = { zh: "秉立锦为", en: "binglijinwei" };

export function Footer() {
  const settings = useCmsSettings();
  const { lang } = useLang();
  const companyName = lang === "zh" ? CNAME.zh : CNAME.en;

  const quickLinks = [
    { label: t("nav_home", lang), href: "/" },
    { label: t("nav_products", lang), href: "/products" },
    { label: lang === "zh" ? "关于我们" : "About Us", href: "/about" },
    { label: t("nav_blog", lang), href: "/blog" },
    { label: t("nav_contact", lang), href: "/contact" },
  ];

  return (
    <footer style={{ backgroundColor: "#1a202c" }}>
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Column 1: Logo + Slogan + Social */}
          <div className="flex flex-col justify-between">
            <div>
              <Image src={(settings.logo_url || "/images/logo.png") + "?v=2"} alt={companyName} width={180} height={48} className="mb-5" unoptimized />
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                {lang === "zh"
                  ? "专业草坪护理与园艺设备供应商，致力于为客户提供高品质的产品和卓越的服务。"
                  : "Professional lawn care and garden equipment supplier, committed to high-quality products and excellent service."}
              </p>
            </div>
            <div className="flex gap-3 mt-8">
              {[{ icon: "facebook-f", href: settings.facebook_url }, { icon: "x-twitter", href: settings.twitter_url }, { icon: "instagram", href: settings.instagram_url }, { icon: "youtube", href: settings.youtube_url }].map((s) => (
                <a key={s.icon} href={s.href} className="w-9 h-9 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-colors text-sm">
                  <i className={`fab fa-${s.icon}`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Contact */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">{t("nav_contact", lang)}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: "rgba(156,194,17,0.15)", color: "#9cc211" }}>
                  <i className="fas fa-map-marker-alt text-sm"></i>
                </div>
                <span className="text-gray-400 text-sm leading-relaxed">{lang === "zh" ? settings.address : (settings.address_en || settings.address)}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(156,194,17,0.15)", color: "#9cc211" }}>
                  <i className="fas fa-phone text-sm"></i>
                </div>
                <span className="text-gray-400 text-sm">{settings.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(156,194,17,0.15)", color: "#9cc211" }}>
                  <i className="fas fa-envelope text-sm"></i>
                </div>
                <span className="text-gray-400 text-sm">{settings.email}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(156,194,17,0.15)", color: "#9cc211" }}>
                  <i className="far fa-clock text-sm"></i>
                </div>
                <span className="text-gray-400 text-sm">{lang === "zh" ? settings.working_hours : (settings.working_hours_en || settings.working_hours)}</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">{lang === "zh" ? "快速链接" : "Quick Links"}</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2">
                    <i className="fas fa-chevron-right text-[10px]" style={{ color: "#9cc211" }}></i>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="container py-5 text-center">
          <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} {companyName}. {t("footer_copyright", lang)}</p>
        </div>
      </div>
    </footer>
  );
}
