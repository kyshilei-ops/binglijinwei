"use client";

import { useState, useEffect } from "react";

// ============ Types ============
export interface BannerData {
  id: number;
  title: string;
  title_en: string;
  subtitle: string;
  subtitle_en: string;
  highlight: string;
  highlight_en: string;
  description: string;
  description_en: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
}

export interface ProductData {
  id: number;
  name: string;
  name_en: string;
  price: number;
  old_price: number | null;
  image_url: string;
  category: string;
  category_en: string;
  badge: string;
  rating: number;
  description: string;
  description_en: string;
  is_featured: boolean;
}

export interface BlogData {
  id: number;
  title: string;
  title_en: string;
  excerpt: string;
  excerpt_en: string;
  content: string;
  image_url: string;
  category: string;
  category_en: string;
  author: string;
  published_at: string;
}

export interface TestimonialData {
  id: number;
  name: string;
  name_en: string;
  role: string;
  role_en: string;
  text: string;
  text_en: string;
  image_url: string;
  rating: number;
}

export interface BrandData {
  id: number;
  name: string;
  image_url: string;
}

export interface SettingsData {
  site_name: string;
  site_name_en: string;
  logo_url: string;
  phone: string;
  email: string;
  address: string;
  address_en: string;
  working_hours: string;
  working_hours_en: string;
  facebook_url: string;
  twitter_url: string;
  instagram_url: string;
  youtube_url: string;
  about_zh: string;
  about_en: string;
}

// ============ Defaults ============
const defaultBanners: BannerData[] = [
  { id: 1, title: "让您的草坪", title_en: "Keep Your Lawn Looking", subtitle: "专业草坪护理", subtitle_en: "Professional Lawn Care", highlight: "全年美丽如新", highlight_en: "Beautiful All Year", description: "为住宅和商业物业提供专业的割草和园艺护理服务。", description_en: "Expert lawn mowing and garden care services for residential and commercial properties.", image_url: "/images/banners/Banner-1.jpg", is_active: true, sort_order: 1 },
  { id: 2, title: "强劲设备助力", title_en: "Powerful Equipment For", subtitle: "优质园艺工具", subtitle_en: "Quality Garden Tools", highlight: "您的花园", highlight_en: "Your Garden", description: "为专业人士和家庭用户提供顶级割草机、打草机和园艺工具。", description_en: "Top-quality lawn mowers and garden tools for professionals and homeowners.", image_url: "/images/banners/banner-2.jpg", is_active: true, sort_order: 2 },
  { id: 3, title: "我们精心呵护", title_en: "We Take Care Of", subtitle: "专家服务", subtitle_en: "Expert Service", highlight: "您的户外空间", highlight_en: "Your Outdoor Space", description: "可靠、实惠、专业的草坪维护服务，值得您信赖。", description_en: "Reliable, affordable, and professional lawn maintenance services you can trust.", image_url: "/images/banners/banner-3.jpg", is_active: true, sort_order: 3 },
];

const defaultProducts: ProductData[] = [
  { id: 1, name: "电动割草机 Pro", name_en: "Electric Lawn Mower Pro", price: 299, old_price: 399, image_url: "/images/products/p01.jpg", category: "割草机", category_en: "Lawn Mowers", badge: "促销", rating: 5, description: "", description_en: "", is_featured: true },
  { id: 2, name: "汽油动力割草机 XL", name_en: "Gas Powered Mower XL", price: 459, old_price: null, image_url: "/images/products/p02.jpg", category: "割草机", category_en: "Lawn Mowers", badge: "", rating: 5, description: "", description_en: "", is_featured: true },
  { id: 3, name: "智能割草机器人", name_en: "Robot Lawn Mower Smart", price: 899, old_price: 1199, image_url: "/images/products/p03.jpg", category: "割草机", category_en: "Lawn Mowers", badge: "热销", rating: 5, description: "", description_en: "", is_featured: true },
  { id: 4, name: "无线打草机", name_en: "Cordless Grass Trimmer", price: 129, old_price: null, image_url: "/images/products/p04.jpg", category: "打草机", category_en: "Trimmers", badge: "", rating: 5, description: "", description_en: "", is_featured: true },
  { id: 5, name: "专业吹叶机", name_en: "Professional Leaf Blower", price: 189, old_price: 249, image_url: "/images/products/p05.jpg", category: "吹叶机", category_en: "Blowers", badge: "促销", rating: 5, description: "", description_en: "", is_featured: true },
  { id: 6, name: "园艺工具8件套", name_en: "Garden Tool Set 8-Piece", price: 79, old_price: null, image_url: "/images/products/p06.jpg", category: "配件", category_en: "Accessories", badge: "新品", rating: 5, description: "", description_en: "", is_featured: true },
  { id: 7, name: "重型电锯", name_en: "Heavy Duty Chainsaw", price: 349, old_price: null, image_url: "/images/products/p07.jpg", category: "工具", category_en: "Tools", badge: "", rating: 5, description: "", description_en: "", is_featured: true },
  { id: 8, name: "电动修枝剪", name_en: "Hedge Trimmer Electric", price: 99, old_price: 149, image_url: "/images/products/p08.jpg", category: "打草机", category_en: "Trimmers", badge: "促销", rating: 5, description: "", description_en: "", is_featured: true },
];

const defaultBlog: BlogData[] = [
  { id: 1, title: "夏季如何养护草坪", title_en: "How to Maintain Your Lawn in Summer", excerpt: "夏季高温对草坪来说是个考验。了解最佳的浇水和修剪技巧，保持草坪翠绿。", excerpt_en: "Summer heat can be tough on your lawn. Learn the best watering and mowing techniques.", content: "", image_url: "/images/blog/blog-13.jpg", category: "草坪护理", category_en: "Lawn Care", author: "管理员", published_at: "2024-06-15" },
  { id: 2, title: "每个家庭必备的10大园艺工具", title_en: "Top 10 Garden Tools Every Homeowner Needs", excerpt: "无论您是初学者还是经验丰富的园丁，这些必备工具都能让您的工作更轻松。", excerpt_en: "Essential tools that every gardener needs to make work easier.", content: "", image_url: "/images/blog/blog-14.jpg", category: "工具", category_en: "Tools", author: "管理员", published_at: "2024-05-28" },
  { id: 3, title: "如何为您的院子选择合适的割草机", title_en: "Choosing the Right Lawn Mower", excerpt: "从手推式到驾驶式，了解哪种类型最适合您的草坪大小和地形。", excerpt_en: "Find out which mower type suits your lawn best.", content: "", image_url: "/images/blog/blog-15.jpg", category: "设备", category_en: "Equipment", author: "管理员", published_at: "2024-04-12" },
];

const defaultTestimonials: TestimonialData[] = [
  { id: 1, name: "张伟", name_en: "John Smith", role: "业主", role_en: "Homeowner", text: "服务非常出色！他们把我杂草丛生的草坪变成了美丽的花园。强烈推荐给任何寻求专业草坪护理的人。", text_en: "Excellent service! They transformed my overgrown lawn into a beautiful garden. Highly recommended!", image_url: "/images/testimonials/testi-01.jpg", rating: 5 },
  { id: 2, name: "李娜", name_en: "Sarah Johnson", role: "物业经理", role_en: "Property Manager", text: "我们已经用他们的服务管理商业物业一年多了。可靠、专业、准时。每次都做得很好！", text_en: "We have been using their services for over a year. Reliable, professional, and always on time!", image_url: "/images/testimonials/testi-02.jpg", rating: 5 },
  { id: 3, name: "王强", name_en: "Mike Williams", role: "景观设计师", role_en: "Landscape Architect", text: "他们的设备质量非常出色。我从他们那里购买了好几件工具，从未让我失望。客户服务也是一流的！", text_en: "The quality of their equipment is outstanding. Customer service is top-notch too!", image_url: "/images/testimonials/testi-03.jpg", rating: 5 },
];

const defaultBrands: BrandData[] = [
  { id: 1, name: "Brand 1", image_url: "/images/brands/b-1.png" },
  { id: 2, name: "Brand 2", image_url: "/images/brands/b-2.png" },
  { id: 3, name: "Brand 3", image_url: "/images/brands/b-3.png" },
  { id: 4, name: "Brand 4", image_url: "/images/brands/b-4.png" },
  { id: 5, name: "Brand 5", image_url: "/images/brands/b-5.png" },
  { id: 6, name: "Brand 6", image_url: "/images/brands/b-6.png" },
];

const defaultSettings: SettingsData = {
  site_name: "LawnMover", site_name_en: "LawnMover", logo_url: "/images/logo.png",
  phone: "(+91) 123-456-789", email: "info@lawnmover.com",
  address: "123 Garden Street, Green City, GC 12345", address_en: "123 Garden Street, Green City, GC 12345",
  working_hours: "Mon - Fri: 8AM - 5PM", working_hours_en: "Mon - Fri: 8AM - 5PM",
  facebook_url: "#", twitter_url: "#", instagram_url: "#", youtube_url: "#",
  about_zh: "", about_en: "",
};

// ============ Storage Keys ============
const KEYS = {
  banners: "cms_banners",
  products: "cms_products",
  blog: "cms_blog",
  testimonials: "cms_testimonials",
  brands: "cms_brands",
  settings: "cms_settings",
};

// Data version - bump this when defaults change to invalidate old localStorage
const CMS_DATA_VERSION = "2.4";

// ============ Helper ============
function loadFromStorage<T>(key: string, defaults: T): T {
  if (typeof window === "undefined") return defaults;
  try {
    const versionKey = key + "_version";
    const savedVersion = localStorage.getItem(versionKey);
    if (savedVersion !== CMS_DATA_VERSION) {
      // Version mismatch, use defaults
      localStorage.removeItem(key);
      localStorage.setItem(versionKey, CMS_DATA_VERSION);
      return defaults;
    }
    const stored = localStorage.getItem(key);
    if (!stored) return defaults;
    const parsed = JSON.parse(stored);
    if (parsed && typeof parsed === "object") return parsed as T;
    return defaults;
  } catch {
    return defaults;
  }
}

// Write to storage with version
export function saveToStorage(key: string, data: unknown) {
  localStorage.setItem(key, JSON.stringify(data));
  localStorage.setItem(key + "_version", CMS_DATA_VERSION);
}

// ============ Hooks ============
export function useCmsBanners() {
  const [data, setData] = useState<BannerData[]>(defaultBanners);
  useEffect(() => {
    const stored = loadFromStorage(KEYS.banners, defaultBanners);
    setData(stored.filter((b: BannerData) => b.is_active).sort((a: BannerData, b: BannerData) => a.sort_order - b.sort_order));
    // Listen for storage changes from other tabs
    const handler = () => {
      const updated = loadFromStorage(KEYS.banners, defaultBanners);
      setData(updated.filter((b: BannerData) => b.is_active).sort((a: BannerData, b: BannerData) => a.sort_order - b.sort_order));
    };
    window.addEventListener("storage", handler);
    // Custom event for same-tab updates
    window.addEventListener("cms-data-changed", handler);
    return () => { window.removeEventListener("storage", handler); window.removeEventListener("cms-data-changed", handler); };
  }, []);
  return data;
}

export function useCmsProducts() {
  const [data, setData] = useState<ProductData[]>(defaultProducts);
  useEffect(() => {
    setData(loadFromStorage(KEYS.products, defaultProducts));
    const handler = () => setData(loadFromStorage(KEYS.products, defaultProducts));
    window.addEventListener("storage", handler);
    window.addEventListener("cms-data-changed", handler);
    return () => { window.removeEventListener("storage", handler); window.removeEventListener("cms-data-changed", handler); };
  }, []);
  return data;
}

export function useCmsBlog() {
  const [data, setData] = useState<BlogData[]>(defaultBlog);
  useEffect(() => {
    setData(loadFromStorage(KEYS.blog, defaultBlog));
    const handler = () => setData(loadFromStorage(KEYS.blog, defaultBlog));
    window.addEventListener("storage", handler);
    window.addEventListener("cms-data-changed", handler);
    return () => { window.removeEventListener("storage", handler); window.removeEventListener("cms-data-changed", handler); };
  }, []);
  return data;
}

export function useCmsTestimonials() {
  const [data, setData] = useState<TestimonialData[]>(defaultTestimonials);
  useEffect(() => {
    setData(loadFromStorage(KEYS.testimonials, defaultTestimonials));
    const handler = () => setData(loadFromStorage(KEYS.testimonials, defaultTestimonials));
    window.addEventListener("storage", handler);
    window.addEventListener("cms-data-changed", handler);
    return () => { window.removeEventListener("storage", handler); window.removeEventListener("cms-data-changed", handler); };
  }, []);
  return data;
}

export function useCmsBrands() {
  const [data, setData] = useState<BrandData[]>(defaultBrands);
  useEffect(() => {
    setData(loadFromStorage(KEYS.brands, defaultBrands));
    const handler = () => setData(loadFromStorage(KEYS.brands, defaultBrands));
    window.addEventListener("storage", handler);
    window.addEventListener("cms-data-changed", handler);
    return () => { window.removeEventListener("storage", handler); window.removeEventListener("cms-data-changed", handler); };
  }, []);
  return data;
}

export function useCmsSettings() {
  const [data, setData] = useState<SettingsData>(defaultSettings);
  useEffect(() => {
    setData(loadFromStorage(KEYS.settings, defaultSettings));
    const handler = () => setData(loadFromStorage(KEYS.settings, defaultSettings));
    window.addEventListener("storage", handler);
    window.addEventListener("cms-data-changed", handler);
    return () => { window.removeEventListener("storage", handler); window.removeEventListener("cms-data-changed", handler); };
  }, []);
  return data;
}

// Helper: call this from admin pages after saving, so frontend updates immediately
export function notifyCmsDataChanged() {
  window.dispatchEvent(new Event("cms-data-changed"));
}
