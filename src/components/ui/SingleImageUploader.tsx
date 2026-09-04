"use client";

import { useState, useRef, useCallback } from "react";
import { useLang } from "@/lib/LanguageContext";
import { uploadImageToSupabase } from "@/lib/supabaseData";

interface SingleImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  bucket?: string;
}

export function SingleImageUploader({ value, onChange, label, bucket }: SingleImageUploaderProps) {
  const { lang } = useLang();
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) { alert(lang === "zh" ? "图片不能超过5MB" : "Image must be under 5MB"); return; }
    setUploading(true);
    try {
      const url = await uploadImageToSupabase(file, bucket);
      onChange(url);
    } catch (e) {
      console.error("Upload failed:", e);
      alert(lang === "zh" ? "上传失败，请重试" : "Upload failed, please retry");
    }
    setUploading(false);
  }, [onChange, lang, bucket]);

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
      onChange(urlInput.trim());
      setUrlInput("");
    }
  };

  return (
    <div>
      {label && <label className="block text-xs font-medium text-gray-600 mb-2">{label}</label>}

      {/* Upload area */}
      <div
        className={`relative w-full border-2 border-dashed rounded-lg mb-3 transition-colors cursor-pointer ${
          dragOver ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-gray-400"
        }`}
        style={{ minHeight: "7rem" }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onPaste={handlePaste}
        onClick={() => fileRef.current?.click()}
      >
        {uploading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center" style={{ color: "#9cc211" }}>
              <i className="fas fa-spinner fa-spin text-lg mb-1"></i>
              <p className="text-xs">{lang === "zh" ? "上传中..." : "Uploading..."}</p>
            </div>
          </div>
        ) : value ? (
          <div className="absolute inset-0 p-2 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="预览" className="max-h-full max-w-full object-contain rounded" />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <i className="fas fa-images text-lg mb-1"></i>
              <p className="text-xs">{lang === "zh" ? "拖拽/点击上传 或 Ctrl+V 粘贴" : "Drop/click to upload or Ctrl+V to paste"}</p>
            </div>
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
      </div>

      {/* URL input + clear */}
      <div className="flex gap-2">
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
        {value && (
          <button type="button" onClick={() => onChange("")} className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-md text-xs transition-colors">
            {lang === "zh" ? "清除" : "Clear"}
          </button>
        )}
      </div>
    </div>
  );
}
