"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";

export default function Dashboard() {
  const { lang } = useLang();
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") !== "true") { window.location.href = "/admin"; }
    else setIsAuthed(true);
  }, []);

  if (!isAuthed) return null;

  const stats = [
    { label: t("sidebar_banners", lang), count: 3, href: "/admin/banners", icon: "fa-image", color: "bg-blue-500" },
    { label: t("sidebar_products", lang), count: 8, href: "/admin/products", icon: "fa-box", color: "bg-green-500" },
    { label: t("sidebar_blog", lang), count: 3, href: "/admin/blog", icon: "fa-newspaper", color: "bg-purple-500" },
    { label: t("sidebar_testimonials", lang), count: 3, href: "/admin/testimonials", icon: "fa-star", color: "bg-yellow-500" },
    { label: t("sidebar_brands", lang), count: 6, href: "/admin/brands", icon: "fa-building", color: "bg-red-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{t("dash_title", lang)}</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center text-white mb-3`}>
              <i className={`fas ${stat.icon}`}></i>
            </div>
            <p className="text-2xl font-bold text-gray-800">{stat.count}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </Link>
        ))}
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">{t("dash_quick_guide", lang)}</h2>
        <div className="space-y-3 text-sm text-gray-600">
          <p><i className="fas fa-check-circle text-green-500 mr-2"></i>{t("dash_guide_1", lang)}</p>
          <p><i className="fas fa-check-circle text-green-500 mr-2"></i><strong>{t("sidebar_banners", lang)}</strong> - {t("dash_guide_2", lang)}</p>
          <p><i className="fas fa-check-circle text-green-500 mr-2"></i><strong>{t("sidebar_products", lang)}</strong> - {t("dash_guide_3", lang)}</p>
          <p><i className="fas fa-check-circle text-green-500 mr-2"></i><strong>{t("sidebar_blog", lang)}</strong> - {t("dash_guide_4", lang)}</p>
          <p><i className="fas fa-check-circle text-green-500 mr-2"></i><strong>{t("sidebar_settings", lang)}</strong> - {t("dash_guide_5", lang)}</p>
        </div>
      </div>
    </div>
  );
}
