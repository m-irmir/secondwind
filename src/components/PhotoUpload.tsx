"use client";

import { useState, useRef } from "react";
import { Camera, Upload, X, Loader2 } from "lucide-react";

interface PhotoUploadProps {
  onProcessed: (result: Record<string, unknown>, photoPath: string) => void;
  onError: (error: string) => void;
}

export default function PhotoUpload({ onProcessed, onError }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      onError("Please select an image file");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    // Upload and process
    setProcessing(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/process-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        // Even on error, we have the photo path
        if (data.photoPath) {
          onProcessed({}, data.photoPath);
        }
        onError(data.error || "Failed to process image");
      } else {
        const { photoPath, ...result } = data;
        onProcessed(result, photoPath);
      }
    } catch {
      onError("Failed to upload image");
    } finally {
      setProcessing(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative rounded-xl overflow-hidden">
          <img src={preview} alt="Preview" className="w-full max-h-96 object-contain bg-gray-50" />
          {processing && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="flex items-center gap-3 text-white">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="font-medium">Analyzing with AI...</span>
              </div>
            </div>
          )}
          {!processing && (
            <button
              onClick={() => {
                setPreview(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center hover:border-indigo-300 transition-colors"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center">
              <Camera className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <p className="text-gray-900 font-medium">Take a photo or upload</p>
              <p className="text-sm text-gray-400 mt-1">
                For best results, include a photo of the tag
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Upload Photo
              </button>
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
        className="hidden"
      />
    </div>
  );
}
