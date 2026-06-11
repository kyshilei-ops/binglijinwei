"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";
import { useCmsProducts, useCmsSettings } from "@/lib/supabaseData";

const T = { bg: "#102e19", primary: "#9cc211", primaryHover: "#b3e014", dark: "#222222", body: "#848484" };

export function TopBar() {
  const { lang } = useLang();
  const settings = useCmsSettings();
  return (
    <div className="text-white text-sm" style={{ backgroundColor: T.bg }}>
      <div className="w-full flex justify-between items-center py-3 px-4 lg:py-4 lg:px-4">
        <div className="flex items-center gap-8">
          <a href={`tel:${settings.phone}`} className="flex items-center gap-2 font-semibold" style={{ fontFamily: "'Rubik', sans-serif", color: T.primary }}>
            <i className="fas fa-phone text-lg"></i>
            <span>{settings.phone}</span>
          </a>
          <span className="flex items-center gap-2" style={{ fontFamily: "'Rubik', sans-serif" }}>
            <i className="far fa-clock"></i>
            {lang === "zh" ? settings.working_hours : (settings.working_hours_en || settings.working_hours)}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {["facebook-f", "x-twitter", "instagram", "youtube"].map((icon) => (
            <a key={icon} href="#" className="w-8 h-8 rounded-full border border-white flex items-center justify-center text-white text-sm hover:border-[#9cc211] hover:text-[#9cc211] transition-colors">
              <i className={`fab fa-${icon}`}></i>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const { lang, toggleLang } = useLang();
  const products = useCmsProducts();
  const settings = useCmsSettings();

  // Display categories (bilingual) with their Chinese key for filtering
  const productCategories = useMemo(() => {
    try {
      const map = new Map<string, string>(); // chineseKey -> displayName
      (products || []).forEach((p) => {
        if (p.category) {
          const display = lang === "zh" ? p.category : ((p as any).category_en || p.category);
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
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <TopBar />
      <div className="container">
        <div className="flex items-center justify-between" style={{ minHeight: 80 }}>
          <Link href="/" className="flex-shrink-0">
            <Image src={(settings.logo_url || "/images/logo.png") + "?v=2"} alt={settings.site_name || "LawnMover"} width={180} height={50} priority unoptimized />
          </Link>

          <nav className="hidden lg:flex items-center">
            <ul className="flex items-center gap-1">
              {menuItems.map((item) => (
                <li key={item.label} className="relative group">
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 px-5 py-[22px] text-base font-semibold uppercase tracking-wide transition-colors"
                    style={{ color: T.dark }}
                  >
                    {item.label}
                    {(item.megaMenu) && <i className="fas fa-chevron-down text-[10px] ml-1"></i>}
                  </Link>

                  {(item as any).children && !item.megaMenu && (
                    <ul className="absolute top-full left-0 bg-white shadow-lg rounded-md py-2 min-w-[220px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      {(item as any).children.map((child: any) => (
                        <li key={child.label}>
                          <Link href={child.href} className="block px-5 py-2 text-sm hover:bg-gray-50 transition-colors" style={{ color: T.body }}>
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}

                  {item.megaMenu && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white shadow-xl rounded-md p-8 min-w-[600px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="grid grid-cols-3 gap-3">
                        {productCategories.length > 0 ? (
                          productCategories.slice(0, 9).map((cat) => (
                            <Link key={cat.key} href={`/products?category=${encodeURIComponent(cat.key)}`} className="px-4 py-2 rounded-md text-sm hover:bg-[#f4fae6] transition-colors" style={{ color: T.body }}>
                              {cat.display}
                            </Link>
                          ))
                        ) : (
                          <Link href="/products" className="px-4 py-2 rounded-md text-sm hover:bg-[#f4fae6] transition-colors" style={{ color: T.body }}>
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
            <button onClick={toggleLang} className="px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors" style={{ backgroundColor: "#f4fae6", color: T.primary }}>
              <i className="fas fa-globe mr-1"></i>{t("lang_switch", lang)}
            </button>
            <button className="lg:hidden text-xl" style={{ color: T.body }} aria-label="Menu">
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
