"use client";

import {
  CheckCircle2,
  ImageIcon,
  LoaderCircle,
  UploadCloud,
  X,
} from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";

import { useMediaMutations } from "@/lib/api/hooks/media";
import { getApiErrorMessage } from "@/lib/axios";
import { useStoreFontMediaMutations } from "@/lib/api/hooks/store-font-media";

type ReviewImageUploadProps = {
  businessId: string;
  onUpload: (imageUrl: string) => void;
  required?: boolean;
};

const ReviewImageUpload = ({
  businessId,
  onUpload,
  required = false,
}: ReviewImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [uploadedFileName, setUploadedFileName] = useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

    const {uploadMedia} = useStoreFontMediaMutations();

  const isUploading = uploadMedia.isPending;

  const handleUploadImage = async (file: File) => {
    setErrorMessage("");
    setSelectedFile(file);

    console.log('file', file);

    try {
      if (!businessId) {
        setErrorMessage("Please select a business first.");
        return;
      }

      const response = await uploadMedia.mutateAsync({
        file,
      });

      console.log('file', response);
      const uploadedUrl = response?.fileUrl;

      if (uploadedUrl) {
        onUpload(uploadedUrl);
        setUploadedFileName(file.name);
      }
    } catch (error) {
      console.log('error', error);
      // setSelectedFile(null);
      // setUploadedFileName("");
      // setErrorMessage(getApiErrorMessage(error));
    }
  };

  const handleFileChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    await handleUploadImage(file);

    event.target.value = "";
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setUploadedFileName("");
    setErrorMessage("");
    onUpload("");
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[var(--store-text)]">
        Review Image
        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        required={required && !uploadedFileName}
        disabled={isUploading}
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        type="button"
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#f16d59] bg-[var(--store-bg-1)] px-4 text-sm font-semibold text-[#f16d59] transition hover:bg-[#f16d59]/10 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isUploading ? (
          <>
            <LoaderCircle className="size-5 animate-spin" />
            Uploading image...
          </>
        ) : uploadedFileName ? (
          <>
            <ImageIcon className="size-5" />
            Change Image
          </>
        ) : (
          <>
            <UploadCloud className="size-5" />
            Upload Review Image
          </>
        )}
      </button>

      {(selectedFile || uploadedFileName) && (
        <div className="mt-2 flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-[var(--store-bg-1)] px-3 py-2 dark:border-gray-700">
          <div className="flex min-w-0 items-center gap-2">
            {isUploading ? (
              <LoaderCircle className="size-4 shrink-0 animate-spin text-[#f16d59]" />
            ) : (
              <CheckCircle2 className="size-4 shrink-0 text-green-600" />
            )}

            <span className="truncate text-sm text-[var(--store-text)]">
              {uploadedFileName ||
                selectedFile?.name}
            </span>
          </div>

          {!isUploading && (
            <button
              type="button"
              aria-label="Remove selected image"
              onClick={handleRemoveImage}
              className="grid size-7 shrink-0 place-items-center rounded-md text-gray-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      )}

      {errorMessage && (
        <p className="mt-2 text-sm text-red-500">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default ReviewImageUpload;