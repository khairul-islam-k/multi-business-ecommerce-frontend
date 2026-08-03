"use client";

import {
  CheckCircle2,
  ImageIcon,
  LoaderCircle,
  UploadCloud,
  X,
} from "lucide-react";
import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react";
import { getApiErrorMessage } from "@/lib/axios";
import { useStoreFontMediaMutations } from "@/lib/api/hooks/store-font-media";

type ReviewImageUploadProps = {
  businessId: string;
  setUrls: Dispatch<SetStateAction<string[]>>;
  required?: boolean;
};

const ReviewImageUpload = ({
  businessId,
  setUrls,
  required = false,
}: ReviewImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [errorMessage, setErrorMessage] =
    useState("");

  const { uploadMedia } = useStoreFontMediaMutations();

  const isUploading = uploadMedia.isPending;

  const handleUploadImage = async (file: File) => {
    setErrorMessage("");

    try {
      if (!businessId) {
        setErrorMessage("Please select a business first.");
        return;
      }

      setSelectedFiles((currentFiles) => [
      ...currentFiles,
      file,
    ]);

      const response = await uploadMedia.mutateAsync({
        file,
      });
      const uploadedUrl = response?.fileUrl;

      if (uploadedUrl) {
        setUrls((currentImages) => [
          ...currentImages,
          uploadedUrl
        ])
      }
    } catch (error) {
      console.log('error', error);
      setSelectedFiles([]);
      setErrorMessage(getApiErrorMessage(error));
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

  const removeImage = (ind: number) => {
    setSelectedFiles((currentFiles) => currentFiles.filter((file, index) => index !== ind));
    setUrls((currentImages) => currentImages.filter((file, index) => index !== ind));
  }

  const handleRemoveImage = () => {
    setSelectedFiles([]);
    setUrls([])
    setErrorMessage("");
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[var(--store-text)]">
        Review Images

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        disabled={isUploading}
        onChange={handleFileChange}
        className="sr-only"
      />

      <button
        type="button"
        disabled={isUploading}
        onClick={() =>
          inputRef.current?.click()
        }
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#f16d59] bg-[var(--store-bg-1)] px-4 text-sm font-semibold text-[#f16d59] transition hover:bg-[#f16d59]/10 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isUploading ? (
          <>
            <LoaderCircle className="size-5 animate-spin" />
            Uploading images...
          </>
        ) : selectedFiles.length > 0 ? (
          <>
            <ImageIcon className="size-5" />
            Add More Images
          </>
        ) : (
          <>
            <UploadCloud className="size-5" />
            Upload Review Images
          </>
        )}
      </button>

      {selectedFiles.length > 0 && (
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[var(--store-text)]">
              {selectedFiles.length}{" "}
              {selectedFiles.length === 1
                ? "image"
                : "images"}{" "}
              uploaded
            </p>

            {!isUploading && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="text-xs font-medium text-red-500 transition hover:text-red-600"
              >
                Remove all
              </button>
            )}
          </div>

          {selectedFiles.map(
            (file, imageIndex) => (
              <div
                key={`${file.name}-${file.lastModified}-${imageIndex}`}
                className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-[var(--store-bg-1)] px-3 py-2 dark:border-gray-700"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-green-600" />

                  <span className="truncate text-sm text-[var(--store-text)]">
                    {file.name}
                  </span>
                </div>

                {!isUploading && (
                  <button
                    type="button"
                    aria-label={`Remove ${file.name}`}
                    onClick={() =>
                      removeImage(
                        imageIndex,
                      )
                    }
                    className="grid size-7 shrink-0 place-items-center rounded-md text-gray-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
            ),
          )}
        </div>
      )}

      {isUploading && (
        <div className="mt-2 flex items-center gap-2 rounded-lg border border-gray-200 bg-[var(--store-bg-1)] px-3 py-2 dark:border-gray-700">
          <LoaderCircle className="size-4 shrink-0 animate-spin text-[#f16d59]" />

          <span className="text-sm text-[var(--store-text)]">
            Uploading selected images...
          </span>
        </div>
      )}

      {required &&
        selectedFiles.length === 0 &&
        !errorMessage && (
          <p className="mt-2 text-xs text-gray-500">
            At least one review image is
            required.
          </p>
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