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
}

export function ResolvedImage({ src, alt, fill, width, height, className, priority, unoptimized }: Props) {
  const [resolved, setResolved] = useState("/images/products/p01.jpg");
  useEffect(() => {
    let c = false;
    resolveImage(src || "").then((r) => { if (!c) setResolved(r); });
    return () => { c = true; };
  }, [src]);

  const isBase64 = resolved.startsWith("data:image/");

  if (fill) {
    return <Image src={resolved} alt={alt} fill className={className} priority={priority} unoptimized={isBase64 || unoptimized} />;
  }
  return <Image src={resolved} alt={alt} width={width || 100} height={height || 100} className={className} priority={priority} unoptimized={isBase64 || unoptimized} />;
}
