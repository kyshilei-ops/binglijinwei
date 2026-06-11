import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroBanner } from "@/components/sections/HeroBanner";
import { ServiceFeatures, CategoriesSection } from "@/components/sections/HomeSections";
import { ProductsSection } from "@/components/sections/ProductsSection";
import { CountdownBanner } from "@/components/sections/CountdownBanner";
import { TestimonialsSection, BrandsSection } from "@/components/sections/TestimonialsBrands";
import { BlogSection } from "@/components/sections/BlogSection";
import { NewsletterSection } from "@/components/sections/NewsletterSection";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <HeroBanner />
        <ServiceFeatures />
        <CategoriesSection />
        <ProductsSection />
        <CountdownBanner />
        <TestimonialsSection />
        <BrandsSection />
        <BlogSection />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
