"use client";

import { useState, useRef, useCallback } from "react";
import { useLang } from "@/lib/LanguageContext";
import { ResolvedImage } from "./ResolvedImage";
import { uploadImageToSupabase } from "@/lib/supabaseData";

interface MultiImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  label?: string;
}

export function MultiImageUploader({ images, onChange, label }: MultiImageUploaderProps) {
  const { lang } = useLang();
  const [dragOver, setDragOver] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) { alert(lang === "zh" ? "图片不能超过5MB" : "Image must be under 5MB"); return; }
    setUploading(true);
    try {
      const url = await uploadImageToSupabase(file);
      onChange([...images, url]);
    } catch (e) {
      console.error("Upload failed:", e);
      alert(lang === "zh" ? "上传失败，请重试" : "Upload failed, please retry");
    }
    setUploading(false);
  }, [images, onChange, lang]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith("image/")) {
        e.preventDefault();
        const file = items[i].getAsFile();
        if (file) processFile(file);
        return;
      }
    }
  }, [processFile]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const addUrl = () => {
    if (urlInput.trim()) {
      onChange([...images, urlInput.trim()]);
      setUrlInput("");
    }
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...images];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    onChange(updated);
  };

  const moveDown = (index: number) => {
    if (index === images.length - 1) return;
    const updated = [...images];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    onChange(updated);
  };

  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-2">{label} ({images.length} 张)</label>

      {/* Upload area */}
      <div
        className={`w-full h-24 border-2 border-dashed rounded-lg mb-3 flex items-center justify-center transition-colors cursor-pointer ${
          dragOver ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-gray-400"
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onPaste={handlePaste}
        onClick={() => fileRef.current?.click()}
      >
        <div className="text-center text-gray-400">
          {uploading ? (
            <div className="text-center" style={{ color: "#9cc211" }}>
              <i className="fas fa-spinner fa-spin text-lg mb-1"></i>
              <p className="text-xs">{lang === "zh" ? "上传中..." : "Uploading..."}</p>
            </div>
          ) : (
            <>
              <i className="fas fa-images text-lg mb-1"></i>
              <p className="text-xs">{lang === "zh" ? "拖拽/点击上传 或 Ctrl+V 粘贴" : "Drop/click to upload or Ctrl+V to paste"}</p>
            </>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
      </div>

      {/* URL input */}
      <div className="flex gap-2 mb-3">
        <input
          type="text" value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onPaste={handlePaste}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addUrl(); } }}
          placeholder={lang === "zh" ? "或粘贴图片地址" : "Or paste image URL"}
          className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-xs focus:ring-2 focus:ring-green-500 outline-none"
        />
        <button type="button" onClick={addUrl} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md text-xs transition-colors">
          {lang === "zh" ? "添加" : "Add"}
        </button>
      </div>

      {/* Thumbnail grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((img, i) => (
            <div key={i} className="relative group border border-gray-200 rounded overflow-hidden">
              <div className="relative h-20 bg-gray-50">
                <ResolvedImage src={img} alt={`Image ${i + 1}`} fill className="object-cover" />
                {i === 0 && (
                  <span className="absolute top-0 left-0 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-br">{lang === "zh" ? "主图" : "Main"}</span>
                )}
              </div>
              {/* Actions overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                <button type="button" onClick={() => moveUp(i)} className="w-5 h-5 bg-white rounded text-[10px] hover:bg-gray-100" title="上移">↑</button>
                <button type="button" onClick={() => moveDown(i)} className="w-5 h-5 bg-white rounded text-[10px] hover:bg-gray-100" title="下移">↓</button>
                <button type="button" onClick={() => removeImage(i)} className="w-5 h-5 bg-red-500 text-white rounded text-[10px] hover:bg-red-600" title="删除">✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
