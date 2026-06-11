"use client";

import Image from "next/image";
import Link from "next/link";
import { safeImageUrl } from "@/lib/imageUrl";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";
import { useCmsBlog } from "@/lib/supabaseData";

export function BlogSection() {
  const { lang } = useLang();
  const posts = useCmsBlog();

  return (
    <section className="py-20 bg-white">
      <div className="container">
        <div className="text-center mb-14">
          <p className="section-subtitle">{t("blog_subtitle", lang)}</p>
          <h2 className="section-title">{t("blog_title", lang)}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.slice(0, 3).map((post) => (
            <article key={post.id} className="group bg-white border border-[#e5e5e5] rounded-lg overflow-hidden hover:shadow-lg transition-all">
              <Link href={`/blog/${post.id}`} className="relative block h-56 overflow-hidden">
                <Image src={safeImageUrl(post.image_url)} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                <span className="absolute top-4 left-4 bg-[#4caf50] text-white text-xs font-medium px-3 py-1 rounded">{lang === "zh" ? post.category : (post.category_en || post.category)}</span>
              </Link>
              <div className="p-6">
                <div className="flex items-center gap-4 text-xs text-[#4a5568] mb-3">
                  <span><i className="far fa-calendar mr-1"></i> {post.published_at}</span>
                  <span><i className="far fa-user mr-1"></i> {post.author}</span>
                </div>
                <h3 className="text-lg font-semibold text-[#1a202c] mb-2 group-hover:text-[#4caf50] transition-colors line-clamp-2">
                  <Link href={`/blog/${post.id}`}>{lang === "zh" ? post.title : (post.title_en || post.title)}</Link>
                </h3>
                <p className="text-sm text-[#4a5568] leading-relaxed mb-4 line-clamp-2">{lang === "zh" ? post.excerpt : (post.excerpt_en || post.excerpt)}</p>
                <Link href="#" className="text-sm font-medium text-[#4caf50] hover:text-[#388e3c] transition-colors inline-flex items-center gap-1">
                  {t("blog_read_more", lang)} <i className="fas fa-arrow-right text-xs"></i>
                </Link>
              </div>
            </article>
          ))}
        </div>
        {posts.length === 0 && <p className="text-center text-gray-400 py-10">No posts yet.</p>}
      </div>
    </section>
  );
}
