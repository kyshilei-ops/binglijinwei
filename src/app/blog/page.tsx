"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { safeImageUrl } from "@/lib/imageUrl";
import { useCmsBlog } from "@/lib/supabaseData";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";
import Image from "next/image";
import Link from "next/link";

export default function BlogPage() {
  const { lang } = useLang();
  const posts = useCmsBlog();

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="py-16 bg-gradient-to-r from-[#1a202c] to-[#2d3748] text-center">
          <h1 className="text-4xl font-bold text-white">{t("nav_blog", lang)}</h1>
          <p className="text-gray-300 mt-3">{t("blog_title", lang)}</p>
        </section>

        <section className="py-16 bg-white">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.id}`} className="group bg-white border border-[#e5e5e5] rounded-lg overflow-hidden hover:shadow-lg transition-all">
                  <div className="relative h-56 overflow-hidden">
                    <Image src={safeImageUrl(post.image_url)} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    <span className="absolute top-4 left-4 bg-[#4caf50] text-white text-xs font-medium px-3 py-1 rounded">{lang === "zh" ? post.category : (post.category_en || post.category)}</span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                      <span><i className="far fa-calendar mr-1"></i>{post.published_at}</span>
                      <span><i className="far fa-user mr-1"></i>{post.author}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-[#1a202c] mb-2 group-hover:text-[#4caf50] transition-colors">{lang === "zh" ? post.title : (post.title_en || post.title)}</h3>
                    <p className="text-sm text-[#4a5568] line-clamp-2">{lang === "zh" ? post.excerpt : (post.excerpt_en || post.excerpt)}</p>
                  </div>
                </Link>
              ))}
            </div>
            {posts.length === 0 && <p className="text-center text-gray-400 py-20">No posts yet.</p>}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
