/** Sanitize image URL for Next.js Image component */
export function safeImageUrl(url: string | undefined | null, fallback = "/images/products/p01.jpg"): string {
  if (!url || url.trim() === "") return fallback;
  // Data URL (base64 uploaded image)
  if (url.startsWith("data:image/")) return url;
  // Already a valid absolute URL
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  // Starts with / - valid local path
  if (url.startsWith("/")) return url;
  // Probably a filename like "1.3.png" - use fallback
  return fallback;
}
