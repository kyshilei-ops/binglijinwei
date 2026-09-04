import Image from "next/image";
import { safeImageUrl } from "@/lib/imageUrl";

interface BlogCoverProps {
  src: string;
  alt: string;
  className?: string;
}

/** Uses a branded product-cutout treatment only for the company's real product photos. */
export function BlogCover({ src, alt, className = "" }: BlogCoverProps) {
  const isProductCutout = src.includes("/images/blog/products/");
  const isPump = src.includes("water-pump");

  return (
    <div className={`blog-cover relative overflow-hidden ${isProductCutout ? `blog-product-cover ${isPump ? "blog-product-cover--pump" : ""}` : ""} ${className}`}>
      <Image
        src={safeImageUrl(src)}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        className={`blog-cover-image transition-transform duration-300 ${isProductCutout ? "object-contain" : "object-cover"}`}
      />
    </div>
  );
}
