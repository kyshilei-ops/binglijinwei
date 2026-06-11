-- Run this in your Supabase SQL Editor to create the tables
-- Go to https://app.supabase.com > your project > SQL Editor

-- Banners (Hero slides)
CREATE TABLE banners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  highlight TEXT,
  description TEXT,
  image_url TEXT,
  button1_label TEXT DEFAULT 'Shop Now',
  button1_url TEXT DEFAULT '#',
  button2_label TEXT DEFAULT 'Contact Us',
  button2_url TEXT DEFAULT '#',
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  old_price DECIMAL(10,2),
  image_url TEXT,
  category TEXT DEFAULT 'General',
  badge TEXT,
  rating INT DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  description TEXT,
  is_featured BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog Posts
CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  excerpt TEXT,
  content TEXT,
  image_url TEXT,
  category TEXT DEFAULT 'General',
  author TEXT DEFAULT 'Admin',
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site Settings (single row)
CREATE TABLE site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_name TEXT DEFAULT 'LawnMover',
  site_description TEXT,
  logo_url TEXT,
  phone TEXT DEFAULT '(+91) 123-456-789',
  email TEXT DEFAULT 'info@lawnmover.com',
  address TEXT DEFAULT '123 Garden Street, Green City',
  working_hours TEXT DEFAULT 'Mon - Fri: 8AM - 5PM',
  facebook_url TEXT DEFAULT '#',
  twitter_url TEXT DEFAULT '#',
  instagram_url TEXT DEFAULT '#',
  youtube_url TEXT DEFAULT '#'
);

-- Testimonials
CREATE TABLE testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  text TEXT,
  image_url TEXT,
  rating INT DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Brands
CREATE TABLE brands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default site settings
INSERT INTO site_settings (site_name, site_description, phone, email, address, working_hours)
VALUES ('LawnMover', 'Professional Lawn Care Services', '(+91) 123-456-789', 'info@lawnmover.com', '123 Garden Street, Green City', 'Mon - Fri: 8AM - 5PM');

-- Enable Row Level Security (RLS)
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read" ON banners FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON blog_posts FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON brands FOR SELECT USING (true);

-- Allow admin full access (using anon key - for simplicity; use service_role for production)
CREATE POLICY "Allow admin all" ON banners FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin all" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin all" ON blog_posts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin all" ON site_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin all" ON testimonials FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin all" ON brands FOR ALL USING (true) WITH CHECK (true);
