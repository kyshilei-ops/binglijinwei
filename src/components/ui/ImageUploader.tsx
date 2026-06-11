"use client";

import { useState, useRef, useCallback } from "react";
import { useLang } from "@/lib/LanguageContext";
import { ResolvedImage } from "./ResolvedImage";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUploader({ value, onChange, label }: ImageUploaderProps) {
  const { lang } = useLang();
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string>(value || "");
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError(lang === "zh" ? "只支持图片文件" : "Only image files supported");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError(lang === "zh" ? "图片不能超过2MB" : "Image must be under 2MB");
      return;
    }
    setError("");
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPreview(dataUrl);
      onChange(dataUrl);
    };
    reader.readAsDataURL(file);
  }, [onChange]);

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

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setPreview(url);
    onChange(url);
  };

  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>

      {/* Preview area */}
      <div
        className={`relative w-full h-40 border-2 border-dashed rounded-lg mb-2 flex items-center justify-center overflow-hidden transition-colors cursor-pointer ${
          dragOver ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-gray-400"
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onPaste={handlePaste}
        onClick={() => fileRef.current?.click()}
      >
        {preview ? (
          <ResolvedImage src={preview} alt="Preview" fill className="object-contain" />
        ) : (
          <div className="text-center text-gray-400">
            <i className="fas fa-cloud-upload-alt text-2xl mb-1"></i>
            <p className="text-xs">{lang === "zh" ? "拖拽图片到这里 或 点击上传" : "Drop image here or click to upload"}</p>
            <p className="text-[10px] mt-0.5">{lang === "zh" ? "也支持 Ctrl+V 粘贴" : "Ctrl+V paste also supported"}</p>
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
      </div>

      {error && <p className="text-red-500 text-xs mb-1">{error}</p>}

      {/* URL fallback */}
      <input
        type="text"
        value={preview.startsWith("data:") ? (lang === "zh" ? "[已上传图片]" : "[Image uploaded]") : (preview || "")}
        onChange={handleUrlChange}
        onPaste={handlePaste}
        placeholder={lang === "zh" ? "或粘贴图片地址 / Ctrl+V粘贴图片" : "Or paste image URL / Ctrl+V to paste"}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-2 focus:ring-green-500 outline-none text-gray-500"
      />
    </div>
  );
}
