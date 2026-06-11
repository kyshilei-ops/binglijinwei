"use client";

import { useState, useEffect } from "react";
import { resolveImage } from "./imageStore";

/** Resolve an image key/URL to a displayable URL (async) */
export function useImageUrl(src: string | undefined | null): string {
  const [url, setUrl] = useState("/images/products/p01.jpg");
  useEffect(() => {
    let cancelled = false;
    resolveImage(src || "").then((resolved) => {
      if (!cancelled) setUrl(resolved);
    });
    return () => { cancelled = true; };
  }, [src]);
  return url;
}
