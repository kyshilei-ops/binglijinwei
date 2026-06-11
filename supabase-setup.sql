-- 在 Supabase SQL Editor 中执行此脚本
-- https://poqarmujiyvcmlfeqzvc.supabase.co → SQL Editor → New query → 粘贴 → Run

-- 1. 横幅
CREATE TABLE IF NOT EXISTS banners (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  title_en TEXT DEFAULT '',
  subtitle TEXT DEFAULT '',
  subtitle_en TEXT DEFAULT '',
  highlight TEXT DEFAULT '',
  highlight_en TEXT DEFAULT '',
  description TEXT DEFAULT '',
  description_en TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 产品
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  name_en TEXT DEFAULT '',
  price DECIMAL(10,2) DEFAULT 0,
  old_price DECIMAL(10,2),
  image_url TEXT DEFAULT '',
  images TEXT DEFAULT '[]',
  category TEXT DEFAULT '',
  category_en TEXT DEFAULT '',
  badge TEXT DEFAULT '',
  rating INT DEFAULT 5,
  description TEXT DEFAULT '',
  description_en TEXT DEFAULT '',
  specs TEXT DEFAULT '',
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 博客
CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  title_en TEXT DEFAULT '',
  excerpt TEXT DEFAULT '',
  excerpt_en TEXT DEFAULT '',
  content TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  category TEXT DEFAULT '',
  category_en TEXT DEFAULT '',
  author TEXT DEFAULT '',
  published_at DATE DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 评价
CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  name_en TEXT DEFAULT '',
  role TEXT DEFAULT '',
  role_en TEXT DEFAULT '',
  text TEXT DEFAULT '',
  text_en TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  rating INT DEFAULT 5,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 品牌
CREATE TABLE IF NOT EXISTS brands (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  image_url TEXT DEFAULT '',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. 站点设置
CREATE TABLE IF NOT EXISTS site_settings (
  id SERIAL PRIMARY KEY DEFAULT 1,
  site_name TEXT DEFAULT '秉立锦为',
  site_name_en TEXT DEFAULT 'binglijinwei',
  logo_url TEXT DEFAULT '/images/logo.png',
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  address TEXT DEFAULT '',
  address_en TEXT DEFAULT '',
  working_hours TEXT DEFAULT '',
  working_hours_en TEXT DEFAULT '',
  facebook_url TEXT DEFAULT '#',
  twitter_url TEXT DEFAULT '#',
  instagram_url TEXT DEFAULT '#',
  youtube_url TEXT DEFAULT '#',
  about_zh TEXT DEFAULT '',
  about_en TEXT DEFAULT ''
);

-- 7. 关于我们
CREATE TABLE IF NOT EXISTS about_content (
  id SERIAL PRIMARY KEY DEFAULT 1,
  content_zh TEXT DEFAULT '',
  content_en TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  years_text TEXT DEFAULT '10+',
  years_label_zh TEXT DEFAULT '年行业经验',
  years_label_en TEXT DEFAULT 'Years Experience',
  features_json TEXT DEFAULT '[]'
);

-- 允许公开读取
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;

-- 公开可读
CREATE POLICY "public_read" ON banners FOR SELECT USING (true);
CREATE POLICY "public_read" ON products FOR SELECT USING (true);
CREATE POLICY "public_read" ON blog_posts FOR SELECT USING (true);
CREATE POLICY "public_read" ON testimonials FOR SELECT USING (true);
CREATE POLICY "public_read" ON brands FOR SELECT USING (true);
CREATE POLICY "public_read" ON site_settings FOR SELECT USING (true);
CREATE POLICY "public_read" ON about_content FOR SELECT USING (true);

-- 任何人都可以增删改（后续可加管理员限制）
CREATE POLICY "public_all" ON banners FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON blog_posts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON testimonials FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON brands FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON site_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON about_content FOR ALL USING (true) WITH CHECK (true);

-- 插入默认设置
INSERT INTO site_settings (id, site_name, site_name_en, logo_url) VALUES (1, '秉立锦为', 'binglijinwei', '/images/logo.png') ON CONFLICT (id) DO NOTHING;
