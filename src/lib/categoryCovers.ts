"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabase";

const path = "cms/category-covers.json";
export type CategoryCovers = Record<string, number>;

export async function loadCategoryCovers(): Promise<CategoryCovers> {
  const { data, error } = await supabase.storage.from("product-images").download(path);
  if (error) {
    if (String((error as { statusCode?: string }).statusCode) === "404" || /not found/i.test(error.message)) return {};
    throw error;
  }
  return JSON.parse(await data.text());
}

export async function saveCategoryCover(category: string, productId: number) {
  const covers = await loadCategoryCovers();
  covers[category] = productId;
  const { error } = await supabase.storage.from("product-images").upload(path, new Blob([JSON.stringify(covers)], { type: "application/json" }), { upsert: true, cacheControl: "0", contentType: "application/json" });
  if (error) throw error;
  window.dispatchEvent(new Event("category-covers-changed"));
  return covers;
}

export function useCategoryCovers() {
  const [covers, setCovers] = useState<CategoryCovers>({});
  useEffect(() => {
    const refresh = () => { loadCategoryCovers().then(setCovers).catch(console.error); };
    refresh();
    window.addEventListener("category-covers-changed", refresh);
    return () => window.removeEventListener("category-covers-changed", refresh);
  }, []);
  return covers;
}
