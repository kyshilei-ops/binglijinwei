"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";
import { useCmsProducts, useCmsSettings } from "@/lib/supabaseData";
import { localizedProductCategory } from "@/lib/contentLocalization";

const T = { bg: "#102e19", primary: "#9cc211", primaryHover: "#b3e014", dark: "#222222", body: "#848484" };

export function TopBar() {
  const { lang } = useLang();
  const settings = useCmsSettings();
  const socialLinks = [
    { icon: "facebook-f", href: settings.facebook_url, label: "Facebook" },
    { icon: "x-twitter", href: settings.twitter_url, label: "X" },
    { icon: "instagram", href: settings.instagram_url, label: "Instagram" },
    { icon: "youtube", href: settings.youtube_url, label: "YouTube" },
  ].filter((item) => item.href && item.href !== "#");
  return (
    <div className="site-topbar text-white text-sm" style={{ backgroundColor: T.bg }}>
      <div className="container">
        <div className="site-topbar-inner">
          <div className="site-topbar-info">
            {settings.phone && <a href={`tel:${settings.phone}`} className="site-topbar-item site-topbar-phone" style={{ fontFamily: "'Rubik', sans-serif" }}>
              <span className="site-topbar-icon"><i className="fas fa-phone"></i></span>
              <span>{settings.phone}</span>
            </a>}
            {(settings.working_hours || settings.working_hours_en) && <span className="site-topbar-item" style={{ fontFamily: "'Rubik', sans-serif" }}>
              <span className="site-topbar-icon"><i className="far fa-clock"></i></span>
              <span>{lang === "zh" ? settings.working_hours : (settings.working_hours_en || settings.working_hours)}</span>
            </span>}
          </div>
          {socialLinks.length > 0 && (
            <div className="site-topbar-socials">
              {socialLinks.map((item) => (
                <a key={item.icon} href={item.href} target="_blank" rel="noreferrer" aria-label={item.label} className="site-social-link">
                  <i className={`fab fa-${item.icon}`}></i>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const { lang, toggleLang } = useLang();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const products = useCmsProducts();
  const settings = useCmsSettings();

  // Display categories (bilingual) with their Chinese key for filtering
  const productCategories = useMemo(() => {
    try {
      const map = new Map<string, string>(); // chineseKey -> displayName
      (products || []).forEach((p) => {
        if (p.category) {
          const display = localizedProductCategory(p.category, p.category_en, lang);
          map.set(p.category, display);
        }
      });
      return [...map.entries()].map(([key, display]) => ({ key, display }));
    } catch { return [] as { key: string; display: string }[]; }
  }, [products, lang]);

  const menuItems = [
    { label: t("nav_home", lang), href: "/" },
    { label: t("nav_products", lang), href: "/products", megaMenu: true },
    { label: t("page_about", lang), href: "/about" },
    { label: t("nav_blog", lang), href: "/blog" },
    { label: t("nav_contact", lang), href: "/contact" },
  ];

  return (
    <header className="site-header sticky top-0 z-50 bg-white">
      <TopBar />
      <div className="site-mainbar">
        <div className="container">
          <div className="site-mainbar-inner">
            <Link href="/" className="site-logo-link" aria-label={settings.site_name || "LawnMover"}>
              <Image className="site-logo" src={(settings.logo_url || "/images/logo.png") + "?v=2"} alt={settings.site_name || "LawnMover"} width={180} height={50} priority unoptimized />
            </Link>

            <nav className="site-desktop-nav hidden lg:flex items-center">
              <ul className="site-nav-list">
                {menuItems.map((item) => (
                  <li key={item.href} className="relative group">
                    <Link
                      href={item.href}
                      aria-current={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href)) ? "page" : undefined}
                      className={`site-nav-link ${pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href)) ? "site-nav-link-active" : ""}`}
                    >
                      {item.label}
                      {(item.megaMenu) && <i className="fas fa-chevron-down text-[10px] ml-1"></i>}
                    </Link>

                    {item.megaMenu && (
                      <div className="site-mega-menu absolute top-full left-1/2 -translate-x-1/2 p-8 min-w-[600px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="grid grid-cols-3 gap-3">
                          {productCategories.length > 0 ? (
                            productCategories.slice(0, 9).map((cat) => (
                              <Link key={cat.key} href={`/products?category=${encodeURIComponent(cat.key)}`} className="site-mega-link">
                                {cat.display}
                              </Link>
                            ))
                          ) : (
                            <Link href="/products" className="site-mega-link">
                              {lang === "zh" ? "全部产品" : "All Products"}
                            </Link>
                          )}
                        </div>
                        <div className="mt-6 pt-4 border-t border-gray-100">
                          <Link href="/products" className="text-sm font-medium" style={{ color: T.primary }}>
                            {lang === "zh" ? "查看全部产品 →" : "View All Products →"}
                          </Link>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-3">
              <button onClick={toggleLang} className="site-language-button">
                <span className="site-language-icon"><i className="fas fa-globe"></i></span>
                <span>{t("lang_switch", lang)}</span>
              </button>
              <button
                onClick={() => setMobileMenuOpen((open) => !open)}
                className="site-menu-button lg:hidden"
                aria-label={t("menu", lang)}
                aria-expanded={mobileMenuOpen}
              >
                <i className={`fas ${mobileMenuOpen ? "fa-times" : "fa-bars"}`}></i>
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="site-mobile-nav lg:hidden" aria-label={t("menu", lang)}>
            <div className="container">
              <ul>
                {menuItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      aria-current={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href)) ? "page" : undefined}
                      className={`site-mobile-link ${pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href)) ? "site-mobile-link-active" : ""}`}
                    >
                      {item.label}
                    </Link>
                    {item.megaMenu && productCategories.length > 0 && (
                      <div className="site-mobile-categories">
                        {productCategories.map((cat) => (
                          <Link key={cat.key} href={`/products?category=${encodeURIComponent(cat.key)}`} onClick={() => setMobileMenuOpen(false)} className="site-mobile-category">
                            {cat.display}
                          </Link>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
