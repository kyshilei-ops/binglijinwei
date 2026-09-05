"use client";

import { useState, useEffect, useMemo, useCallback, type Dispatch, type SetStateAction } from "react";
import { supabase } from "./supabase";

// Share short-lived table snapshots so sections using the same table do not
// issue duplicate requests or briefly disappear during client-side navigation.
const tableCache = new Map<string, { rows: unknown[]; fetchedAt: number }>();
const tableRequests = new Map<string, Promise<unknown[]>>();
const CACHE_TTL = 15_000;

function fetchTable(table: string) {
  const pending = tableRequests.get(table);
  if (pending) return pending;

  const request = Promise.resolve(
    supabase.from(table).select("*").order("id").then(({ data: rows, error }) => {
      if (error) throw error;
      const result = rows || [];
      tableCache.set(table, { rows: result, fetchedAt: Date.now() });
      return result as unknown[];
    }),
  ).finally(() => tableRequests.delete(table));

  tableRequests.set(table, request);
  return request;
}

// ─── Generic fetcher with React state ───
function useTable<T>(table: string) {
  const cached = tableCache.get(table);
  const [data, setLocalData] = useState<T[]>(() => (cached?.rows as T[] | undefined) || []);
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    let cancelled = false;
    const current = tableCache.get(table);
    if (current && Date.now() - current.fetchedAt < CACHE_TTL) return () => { cancelled = true; };

    fetchTable(table)
      .then((rows) => { if (!cancelled) setLocalData(rows as T[]); })
      .catch((error) => console.error(`Could not load ${table}:`, error))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [table]);

  const setData: Dispatch<SetStateAction<T[]>> = useCallback((next) => {
    setLocalData((current) => {
      const rows = typeof next === "function" ? next(current) : next;
      tableCache.set(table, { rows, fetchedAt: Date.now() });
      return rows;
    });
  }, [table]);

  return { data, setData, loading };
}

// ─── Types ───
export interface BannerRow { id: number; title: string; title_en: string; subtitle: string; subtitle_en: string; highlight: string; highlight_en: string; description: string; description_en: string; image_url: string; is_active: boolean; sort_order: number; }
export interface ProductRow { id: number; name: string; name_en: string; price: number; old_price: number | null; image_url: string; images: string; category: string; category_en: string; badge: string; rating: number; description: string; description_en: string; specs: string; is_featured: boolean; }
export interface BlogRow { id: number; title: string; title_en: string; excerpt: string; excerpt_en: string; content: string; image_url: string; category: string; category_en: string; author: string; published_at: string; }
export interface TestimonialRow { id: number; name: string; name_en: string; role: string; role_en: string; text: string; text_en: string; image_url: string; rating: number; sort_order: number; }
export interface BrandRow { id: number; name: string; image_url: string; sort_order: number; }
export interface SettingsRow { id: number; site_name: string; site_name_en: string; logo_url: string; phone: string; email: string; address: string; address_en: string; working_hours: string; working_hours_en: string; facebook_url: string; twitter_url: string; instagram_url: string; youtube_url: string; about_zh: string; about_en: string; }
export interface AboutRow { id: number; content_zh: string; content_en: string; image_url: string; years_text: string; years_label_zh: string; years_label_en: string; features_json: string; }

// ─── Hooks ───
export function useCmsBanners() {
  const { data } = useTable<BannerRow>("banners");
  return useMemo(() => data.filter(b => b.is_active).sort((a, b) => a.sort_order - b.sort_order), [data]);
}
export function useCmsBannersAll() { return useTable<BannerRow>("banners"); }

export function useCmsProducts() {
  const { data } = useTable<ProductRow>("products");
  return data;
}
export function useCmsProductsAll() { return useTable<ProductRow>("products"); }

export function useCmsBlog() {
  const { data } = useTable<BlogRow>("blog_posts");
  return data;
}
export function useCmsBlogAll() { return useTable<BlogRow>("blog_posts"); }

export function useCmsTestimonials() {
  const { data } = useTable<TestimonialRow>("testimonials");
  return data;
}
export function useCmsTestimonialsAll() { return useTable<TestimonialRow>("testimonials"); }

export function useCmsBrands() {
  const { data } = useTable<BrandRow>("brands");
  return data;
}
export function useCmsBrandsAll() { return useTable<BrandRow>("brands"); }

export function useCmsSettings() {
  const { data } = useTable<SettingsRow>("site_settings");
  return data[0] || defaultSettings;
}

const defaultSettings: SettingsRow = {
  id: 1, site_name: "秉立锦为", site_name_en: "binglijinwei", logo_url: "/images/logo.png",
  phone: "", email: "", address: "", address_en: "",
  working_hours: "", working_hours_en: "",
  facebook_url: "#", twitter_url: "#", instagram_url: "#", youtube_url: "#",
  about_zh: "", about_en: "",
};

// ─── Save helpers (for admin pages) ───
export async function saveBanner(item: Partial<BannerRow>) {
  const { data: max, error: readError } = await supabase.from("banners").select("id").order("id", { ascending: false }).limit(1);
  if (readError) throw readError;
  const nextId = max?.[0]?.id ? max[0].id + 1 : 1;
  const { title, title_en, subtitle, subtitle_en, highlight, highlight_en, description, description_en, image_url, is_active, sort_order } = item;
  const toSave = { id: item.id || nextId, title, title_en, subtitle, subtitle_en, highlight, highlight_en, description, description_en, image_url, is_active, sort_order };
  const result = await supabase.from("banners").upsert(toSave, { onConflict: "id" }).select();
  if (result.error) throw result.error;
  if (!result.data?.length) throw new Error("横幅未保存，请重试");
  tableCache.delete("banners");
  return result;
}
export async function deleteBanner(id: number) {
  const result = await supabase.from("banners").delete().eq("id", id).select("id");
  if (result.error) throw result.error;
  if (!result.data?.length) throw new Error("横幅删除失败，请刷新重试");
  tableCache.delete("banners");
  return result;
}

export async function saveProduct(item: Partial<ProductRow>) {
  const { data: max } = await supabase.from("products").select("id").order("id", { ascending: false }).limit(1);
  const nextId = max?.[0]?.id ? max[0].id + 1 : 1;
  const toSave = { ...item, id: item.id || nextId };
  return supabase.from("products").upsert(toSave, { onConflict: "id" }).select();
}
export async function deleteProduct(id: number) { return supabase.from("products").delete().eq("id", id); }

export async function saveBlog(item: Partial<BlogRow>) {
  if (item.id) return supabase.from("blog_posts").upsert(item).select();
  const newItem = { ...item };
  delete newItem.id;
  return supabase.from("blog_posts").insert(newItem).select();
}
export async function deleteBlog(id: number) { return supabase.from("blog_posts").delete().eq("id", id); }

export async function saveTestimonial(item: Partial<TestimonialRow>) {
  if (item.id) return supabase.from("testimonials").upsert(item).select();
  return supabase.from("testimonials").insert(item).select();
}
export async function deleteTestimonial(id: number) { return supabase.from("testimonials").delete().eq("id", id); }

export async function saveBrand(item: Partial<BrandRow>) {
  if (item.id) return supabase.from("brands").upsert(item).select();
  return supabase.from("brands").insert(item).select();
}
export async function deleteBrand(id: number) { return supabase.from("brands").delete().eq("id", id); }

export async function saveSettings(item: SettingsRow) {
  return supabase.from("site_settings").upsert(item).select();
}

// ─── Legacy compatibility (no-ops for admin pages) ───
export function notifyCmsDataChanged() {
  // Data refreshes on next render via Supabase fetch
}
export function saveToStorage(key: string, data: unknown) {
  void key;
  void data;
  // No-op: data saved via Supabase
}

// ─── Image upload to Supabase Storage ───
export async function uploadImageToSupabase(file: File, bucket = "product-images"): Promise<string> {
  const ext = file.name.split(".").pop() || "png";
  const name = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(name, file, { upsert: true });
  if (error) throw error;
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(name);
  return urlData.publicUrl;
}
