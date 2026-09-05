import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroBanner } from "@/components/sections/HeroBanner";
import { ServiceFeatures, CategoriesSection } from "@/components/sections/HomeSections";
import { ProductsSection } from "@/components/sections/ProductsSection";
import { CountdownBanner } from "@/components/sections/CountdownBanner";
import { TestimonialsSection, BrandsSection } from "@/components/sections/TestimonialsBrands";
import { BlogSection } from "@/components/sections/BlogSection";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { LocalizedPageMetadata } from "@/components/ui/LocalizedPageMetadata";

export default function Home() {
  return (
    <>
      <Header />
      <LocalizedPageMetadata
        titleZh="秉立锦为"
        titleEn="Binglijinwei"
        descriptionZh="微耕机、汽油机水泵等小型农业机械产品与选型支持。"
        descriptionEn="Micro tillers, gasoline water pumps and compact agricultural equipment with product selection support."
      />
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
