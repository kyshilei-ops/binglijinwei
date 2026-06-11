"use client";

import Link from "next/link";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { lang, toggleLang } = useLang();

  const menuItems = [
    { label: t("sidebar_dashboard", lang), href: "/admin/dashboard", icon: "fa-home" },
    { label: t("sidebar_banners", lang), href: "/admin/banners", icon: "fa-image" },
    { label: t("sidebar_products", lang), href: "/admin/products", icon: "fa-box" },
    { label: t("sidebar_blog", lang), href: "/admin/blog", icon: "fa-newspaper" },
    { label: t("sidebar_testimonials", lang), href: "/admin/testimonials", icon: "fa-star" },
    { label: t("sidebar_brands", lang), href: "/admin/brands", icon: "fa-building" },
    { label: lang === "zh" ? "关于我们" : "About Us", href: "/admin/about", icon: "fa-info-circle" },
    { label: t("sidebar_settings", lang), href: "/admin/settings", icon: "fa-cog" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white flex-shrink-0 flex flex-col">
        <div className="p-5 border-b border-gray-700">
          <h1 className="text-lg font-bold">{t("admin_cms_title", lang)}</h1>
          <p className="text-xs text-gray-400">{t("admin_cms_subtitle", lang)}</p>
        </div>
        <nav className="p-3 flex-1">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                  <i className={`fas ${item.icon} w-5 text-center`}></i>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-700 flex justify-between items-center">
          <Link href="/" className="text-xs text-gray-400 hover:text-white transition-colors" target="_blank">
            <i className="fas fa-external-link-alt mr-1"></i>{t("admin_view_site", lang)}
          </Link>
          <button onClick={toggleLang} className="text-xs text-gray-400 hover:text-green-400 transition-colors">
            <i className="fas fa-globe mr-1"></i>{t("lang_switch", lang)}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">{t("admin_panel", lang)}</h2>
          <button
            onClick={() => { sessionStorage.removeItem("admin_auth"); window.location.href = "/admin"; }}
            className="text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            <i className="fas fa-sign-out-alt mr-1"></i>{t("admin_logout", lang)}
          </button>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
