"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Sparkles } from "lucide-react";
import PhotoUpload from "@/components/PhotoUpload";
import ItemForm from "@/components/ItemForm";

function UploadContent() {
  const searchParams = useSearchParams();
  const preSelectedStoreId = searchParams.get("store") || undefined;
  const [step, setStep] = useState<"upload" | "review">("upload");
  const [extractedData, setExtractedData] = useState<Record<string, unknown>>({});
  const [photoPaths, setPhotoPaths] = useState<string[]>([]);
  const [error, setError] = useState("");

  function handleProcessed(result: Record<string, unknown>, paths: string[]) {
    setExtractedData(result);
    setPhotoPaths(paths);
    setStep("review");
    setError("");
  }

  function handleError(msg: string) {
    setError(msg);
    if (photoPaths.length > 0) setStep("review");
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full text-sm text-indigo-700 font-medium mb-3">
          <Sparkles className="w-4 h-4" />
          AI-Powered
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Item</h1>
        <p className="text-sm text-gray-400 mt-1">
          {step === "upload"
            ? "Upload photos and our AI will extract the details"
            : "Review and edit the AI-generated details"}
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 justify-center">
        <div className={`w-8 h-1 rounded-full ${step === "upload" ? "bg-indigo-600" : "bg-indigo-200"}`} />
        <div className={`w-8 h-1 rounded-full ${step === "review" ? "bg-indigo-600" : "bg-gray-200"}`} />
      </div>

      {error && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
          {error}
          {error.includes("GEMINI_API_KEY") && (
            <span className="block mt-1 text-xs text-amber-500">
              You can still fill in the details manually below.
            </span>
          )}
        </div>
      )}

      {step === "upload" ? (
        <PhotoUpload onProcessed={handleProcessed} onError={handleError} />
      ) : (
        <ItemForm initialData={extractedData} photoPaths={photoPaths} preSelectedStoreId={preSelectedStoreId} />
      )}
    </div>
  );
}

export default function UploadPage() {
  return (
    <Suspense>
      <UploadContent />
    </Suspense>
  );
}
