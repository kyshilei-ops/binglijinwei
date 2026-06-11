// IndexedDB image storage — avoids localStorage 5MB quota

const DB_NAME = "lawnmover-images";
const STORE = "images";

function open(): Promise<IDBDatabase> {
  return new Promise((ok, fail) => {
    const r = indexedDB.open(DB_NAME, 1);
    r.onupgradeneeded = () => { if (!r.result.objectStoreNames.contains(STORE)) r.result.createObjectStore(STORE); };
    r.onsuccess = () => ok(r.result);
    r.onerror = () => fail(r.error);
  });
}

/** Store a base64 data URL, returns a lookup key */
export async function storeImage(dataUrl: string): Promise<string> {
  if (!dataUrl.startsWith("data:image/")) return dataUrl; // skip non-base64
  const key = `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const db = await open();
  return new Promise((ok, fail) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(dataUrl, key);
    tx.oncomplete = () => { db.close(); ok(key); };
    tx.onerror = () => { db.close(); fail(tx.error); };
  });
}

/** Resolve an image key or URL to a displayable URL */
export async function resolveImage(keyOrUrl: string): Promise<string> {
  if (keyOrUrl.startsWith("data:image/")) return keyOrUrl;
  if (keyOrUrl.startsWith("http") || keyOrUrl.startsWith("/")) return keyOrUrl;
  if (!keyOrUrl.startsWith("img_")) return keyOrUrl || "/images/products/p01.jpg";
  try {
    const db = await open();
    return new Promise((ok) => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).get(keyOrUrl);
      req.onsuccess = () => { db.close(); ok(req.result || "/images/products/p01.jpg"); };
      req.onerror = () => { db.close(); ok("/images/products/p01.jpg"); };
    });
  } catch {
    return "/images/products/p01.jpg";
  }
}

/** Delete an image */
export async function deleteImage(key: string): Promise<void> {
  if (!key.startsWith("img_")) return;
  const db = await open();
  return new Promise((ok) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(key);
    tx.oncomplete = () => { db.close(); ok(); };
    tx.onerror = () => { db.close(); ok(); };
  });
}

/** Process images array: move base64 to IndexedDB, return keys */
export async function saveImages(images: string[]): Promise<string[]> {
  const result: string[] = [];
  for (const img of images) {
    if (img.startsWith("data:image/")) {
      result.push(await storeImage(img));
    } else {
      result.push(img);
    }
  }
  return result;
}
