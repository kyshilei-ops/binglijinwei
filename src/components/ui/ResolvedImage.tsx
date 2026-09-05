"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { resolveImage } from "@/lib/imageStore";

interface Props {
  src: string | undefined | null;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  unoptimized?: boolean;
  sizes?: string;
  quality?: number;
}

function directImageUrl(src: string | undefined | null) {
  if (!src) return "";
  if (src.startsWith("data:image/") || src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) {
    return src;
  }
  return "";
}

export function ResolvedImage({ src, alt, fill, width, height, className, priority, unoptimized, sizes, quality }: Props) {
  const directSrc = directImageUrl(src);
  const [legacyImage, setLegacyImage] = useState({ key: "", url: "" });

  useEffect(() => {
    let cancelled = false;

    // Cloud URLs, local paths and data URLs can be rendered immediately.
    // Only legacy IndexedDB image keys need asynchronous resolution.
    if (!src || directImageUrl(src)) return () => { cancelled = true; };

    resolveImage(src).then((result) => {
      if (!cancelled) setLegacyImage({ key: src, url: directImageUrl(result) });
    });
    return () => { cancelled = true; };
  }, [src]);

  const displaySrc = directSrc || (legacyImage.key === src ? legacyImage.url : "");

  // Keep the parent's own background visible while an image is unresolved.
  // Do not flash an unrelated default product image.
  if (!displaySrc) return null;

  const isBase64 = displaySrc.startsWith("data:image/");

  if (fill) {
    return <Image src={displaySrc} alt={alt} fill className={className} priority={priority} sizes={sizes} quality={quality} unoptimized={isBase64 || unoptimized} />;
  }
  return <Image src={displaySrc} alt={alt} width={width || 100} height={height || 100} className={className} priority={priority} sizes={sizes} quality={quality} unoptimized={isBase64 || unoptimized} />;
}
