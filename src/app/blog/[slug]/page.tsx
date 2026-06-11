"use client";

import { useParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { safeImageUrl } from "@/lib/imageUrl";
import { useCmsBlog } from "@/lib/supabaseData";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";
import Image from "next/image";
import Link from "next/link";

export default function BlogPostPage() {
  const { slug } = useParams();
  const { lang } = useLang();
  const posts = useCmsBlog();
  const post = posts.find((p) => p.id === Number(slug));

  if (!post) {
    return (
      <>
        <Header />
        <main className="flex-1 flex items-center justify-center py-40">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{t("blog_not_found", lang)}</h1>
            <Link href="/blog" className="text-[#4caf50] hover:underline">{t("blog_back", lang)}</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="py-12">
          <div className="container max-w-3xl">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
              <Link href="/" className="hover:text-[#4caf50]">{t("nav_home", lang)}</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-[#4caf50]">{t("nav_blog", lang)}</Link>
              <span>/</span>
              <span className="text-gray-600 truncate">{lang === "zh" ? post.title : (post.title_en || post.title)}</span>
            </div>

            <span className="inline-block bg-[#4caf50] text-white text-xs font-medium px-3 py-1 rounded mb-4">{lang === "zh" ? post.category : (post.category_en || post.category)}</span>
            <h1 className="text-3xl md:text-4xl font-bold text-[#1a202c] mb-4">{lang === "zh" ? post.title : (post.title_en || post.title)}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-400 mb-8">
              <span><i className="far fa-calendar mr-1"></i>{post.published_at}</span>
              <span><i className="far fa-user mr-1"></i>{post.author}</span>
            </div>

            {post.image_url && (
              <div className="relative h-80 md:h-96 rounded-lg overflow-hidden mb-8">
                <Image src={safeImageUrl(post.image_url)} alt={post.title} fill className="object-cover" />
              </div>
            )}

            <div className="prose max-w-none text-[#4a5568] leading-relaxed text-lg">
              {post.content ? (
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              ) : (
                <>
                  <p>{post.excerpt}</p>
                  <p className="mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                  <p className="mt-4">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
