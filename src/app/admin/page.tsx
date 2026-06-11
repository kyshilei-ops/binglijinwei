"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { lang } = useLang();
  const router = useRouter();

  useEffect(() => {
    const auth = sessionStorage.getItem("admin_auth");
    if (auth === "true") { setIsLoggedIn(true); router.push("/admin/dashboard"); }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      sessionStorage.setItem("admin_auth", "true");
      setIsLoggedIn(true);
      router.push("/admin/dashboard");
    } else {
      setError(t("admin_login_error", lang));
    }
  };

  if (isLoggedIn) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">{t("admin_login_title", lang)}</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin_login_password", lang)}</label>
            <input
              type="password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              placeholder={t("admin_login_placeholder", lang)} required
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-medium transition-colors">
            {t("admin_login_btn", lang)}
          </button>
        </form>
        <p className="text-xs text-gray-400 text-center mt-4">{t("admin_login_hint", lang)}</p>
      </div>
    </div>
  );
}
