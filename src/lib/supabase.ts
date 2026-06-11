import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  highlight: string;
  description: string;
  image_url: string;
  button1_label: string;
  button1_url: string;
  button2_label: string;
  button2_url: string;
  sort_order: number;
  is_active: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  old_price: number | null;
  image_url: string;
  category: string;
  badge: string | null;
  rating: number;
  description: string;
  is_featured: boolean;
  sort_order: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  category: string;
  author: string;
  published_at: string;
}

export interface SiteSettings {
  id: string;
  site_name: string;
  site_description: string;
  logo_url: string;
  phone: string;
  email: string;
  address: string;
  working_hours: string;
  facebook_url: string;
  twitter_url: string;
  instagram_url: string;
  youtube_url: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  image_url: string;
  rating: number;
  sort_order: number;
}

export interface Brand {
  id: string;
  name: string;
  image_url: string;
  sort_order: number;
}
