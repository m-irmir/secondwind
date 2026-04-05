"use client";

import { useState, useRef } from "react";
import { Camera, ImagePlus, Upload, X, Loader2, Plus, Tag } from "lucide-react";

interface PhotoUploadProps {
  onProcessed: (result: Record<string, unknown>, photoPaths: string[]) => void;
  onError: (error: string) => void;
}

interface PhotoEntry {
  file: File;
  preview: string;
  label: "item" | "tag";
}

// Compress image client-side to stay under Vercel's 4.5MB body limit
function compressImage(file: File, maxDim = 1200, quality = 0.8): Promise<File> {
  return new Promise((resolve) => {
    // Skip non-image or already small files
    if (!file.type.startsWith("image/") || file.size < 500_000) {
      resolve(file);
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;

      // Scale down if larger than maxDim
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: "image/jpeg" }));
          } else {
            resolve(file);
          }
        },
        "image/jpeg",
        quality
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };
    img.src = url;
  });
}

export default function PhotoUpload({ onProcessed, onError }: PhotoUploadProps) {
  const [photos, setPhotos] = useState<PhotoEntry[]>([]);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileBrowseRef = useRef<HTMLInputElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);
  const tagBrowseRef = useRef<HTMLInputElement>(null);

  async function addPhoto(file: File, label: "item" | "tag") {
    if (!file.type.startsWith("image/")) {
      onError("Please select an image file");
      return;
    }
    const compressed = await compressImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotos((prev) => [...prev, { file: compressed, preview: e.target?.result as string, label }]);
    };
    reader.readAsDataURL(compressed);
  }

  function removePhoto(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit() {
    if (photos.length === 0) return;
    setProcessing(true);

    try {
      const formData = new FormData();
      // Send item photo first, then tag photos
      const sorted = [...photos].sort((a, b) => (a.label === "item" ? -1 : 1) - (b.label === "item" ? -1 : 1));
      for (const photo of sorted) {
        formData.append("images", photo.file);
      }

      const res = await fetch("/api/process-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.photoPaths?.length) {
          onProcessed({}, data.photoPaths);
        }
        onError(data.error || `Server error (${res.status})`);
      } else {
        const { photoPaths, ...result } = data;
        onProcessed(result, photoPaths);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      onError(`Upload failed: ${msg}`);
    } finally {
      setProcessing(false);
    }
  }

  const hasItemPhoto = photos.some((p) => p.label === "item");

  return (
    <div className="space-y-4">
      {/* Item photo */}
      {!hasItemPhoto ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) addPhoto(file, "item");
          }}
          className="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center hover:border-indigo-300 transition-colors"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center">
              <Camera className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <p className="text-gray-900 font-medium">Add a photo of the item</p>
              <p className="text-sm text-gray-400 mt-1">
                This will be the main listing photo
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Camera className="w-4 h-4" />
                Take Photo
              </button>
              <button
                onClick={() => fileBrowseRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 text-sm font-medium rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-colors"
              >
                <ImagePlus className="w-4 h-4" />
                Choose from Files
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Photo previews */}
          <div className="grid grid-cols-2 gap-3">
            {photos.map((photo, i) => (
              <div key={i} className="relative rounded-xl overflow-hidden bg-gray-50">
                <img src={photo.preview} alt={photo.label} className="w-full aspect-square object-cover" />
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/50 rounded-full text-xs text-white font-medium">
                  {photo.label === "item" ? "Item" : "Tag"}
                </div>
                {!processing && (
                  <button
                    onClick={() => removePhoto(i)}
                    className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 text-white rounded-full"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}

            {/* Add tag photo button */}
            {!processing && (
              <div className="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Tag className="w-5 h-5 text-gray-400" />
                </div>
                <span className="text-xs text-gray-400 font-medium">Add Tag Photo</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => tagInputRef.current?.click()}
                    className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Take photo"
                  >
                    <Camera className="w-3.5 h-3.5 text-gray-500" />
                  </button>
                  <button
                    onClick={() => tagBrowseRef.current?.click()}
                    className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Choose from files"
                  >
                    <ImagePlus className="w-3.5 h-3.5 text-gray-500" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Processing overlay */}
          {processing && (
            <div className="flex items-center justify-center gap-3 p-4 bg-indigo-50 rounded-xl">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
              <span className="text-sm font-medium text-indigo-700">
                Analyzing {photos.length} photo{photos.length > 1 ? "s" : ""} with AI...
              </span>
            </div>
          )}

          {/* Submit button */}
          {!processing && (
            <button
              onClick={handleSubmit}
              className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors text-sm flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Analyze with AI
            </button>
          )}
        </div>
      )}

      {/* Hidden file inputs: camera capture */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) addPhoto(file, "item");
          e.target.value = "";
        }}
        className="hidden"
      />
      <input
        ref={tagInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) addPhoto(file, "tag");
          e.target.value = "";
        }}
        className="hidden"
      />
      {/* Hidden file inputs: file browser (no capture attr) */}
      <input
        ref={fileBrowseRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) addPhoto(file, "item");
          e.target.value = "";
        }}
        className="hidden"
      />
      <input
        ref={tagBrowseRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) addPhoto(file, "tag");
          e.target.value = "";
        }}
        className="hidden"
      />
    </div>
  );
}
