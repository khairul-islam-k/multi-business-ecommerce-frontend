"use client";

import {
  Check,
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  ImageIcon,
  LoaderCircle,
  RefreshCw,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import Image from "next/image";
import {
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useMediaAssets,
  useMediaMutations,
} from "@/lib/api/hooks/media";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import { ProductImage } from "@/app/(dashboard)/admin/dashboard/product-catalog/products/_components/product-form";


const PAGE_LIMIT = 12;

type MediaAsset = {
  id: string;
  fileUrl: string;
  fileName?: string | null;
  altText?: string | null;
};

type ImageSelectModalProps = {
  open: boolean;
  businessId: string;
  selectedUrl?: ProductImage[];
  onClose: () => void;
  onSelect: Dispatch<SetStateAction<ProductImage[]>>;
};

type FeedbackMessage = {
  type: "success" | "error";
  text: string;
};

const imageUrlSet = (url?: string | null) => {
  if (!url) {
    return "";
  }

  if (url.startsWith("http")) {
    return url;
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

  return `${baseUrl}${url}`;
};

const getVisiblePages = (
  currentPage: number,
  totalPages: number,
) => {
  const maximumVisiblePages = 5;

  if (totalPages <= maximumVisiblePages) {
    return Array.from(
      { length: totalPages },
      (_, index) => index + 1,
    );
  }

  let startPage = Math.max(currentPage - 2, 1);
  let endPage = Math.min(
    startPage + maximumVisiblePages - 1,
    totalPages,
  );

  if (endPage - startPage < maximumVisiblePages - 1) {
    startPage = Math.max(
      endPage - maximumVisiblePages + 1,
      1,
    );
  }

  return Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index,
  );
};

const MultiImageSelectModal = ({
  open,
  selectedUrl,
  onClose,
  onSelect,
  businessId,
}: ImageSelectModalProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(
    null,
  );

//   const business = useAuthStore(
//     (state) => state.selectedBusiness,
//   );

//   const businessId = business?.id ?? "";

  const [currentUrl, setCurrentUrl] = useState<
    ProductImage[]
  >([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [imageFiles, setImageFiles] = useState<File[]>(
    [],
  );

  const [feedback, setFeedback] =
    useState<FeedbackMessage | null>(null);

  const { data, isLoading, isFetching } =
    useMediaAssets(businessId, {
      page: currentPage,
      limit: PAGE_LIMIT,
      sortBy: "createdAt",
      sortOrder: "desc",
    });

  const { uploadMedia, uploadMediaBulk } =
    useMediaMutations(businessId);

  const isUploading =
    uploadMedia.isPending || uploadMediaBulk.isPending;

  const images: MediaAsset[] = data?.items ?? [];
  const totalPages = data?.meta?.totalPages ?? 0;

  const visiblePages = getVisiblePages(
    currentPage,
    totalPages,
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    setCurrentUrl(selectedUrl ?? []);
    setImageFiles([]);
    setCurrentPage(1);
    setFeedback(null);
  }, [open, selectedUrl]);

  useEffect(() => {
    if (!feedback) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setFeedback(null);
    }, 3000);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [feedback]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (
        event.key === "Escape" &&
        !isUploading
      ) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, [open, isUploading, onClose]);

  const showFeedback = (
    type: FeedbackMessage["type"],
    text: string,
  ) => {
    setFeedback({
      type,
      text,
    });
  };

  const handleFileSelect = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFiles = Array.from(
      event.target.files ?? [],
    );

    if (!selectedFiles.length) {
      return;
    }

    setImageFiles((previousFiles) => {
      const newFiles = selectedFiles.filter(
        (selectedFile) =>
          !previousFiles.some(
            (previousFile) =>
              previousFile.name === selectedFile.name &&
              previousFile.size === selectedFile.size,
          ),
      );

      return [...previousFiles, ...newFiles];
    });

    event.target.value = "";
  };

  const handleRemoveFile = (fileIndex: number) => {
    if (isUploading) {
      return;
    }

    setImageFiles((previousFiles) =>
      previousFiles.filter(
        (_, index) => index !== fileIndex,
      ),
    );
  };

  const handleImageBulkUpload = async () => {
    if (!imageFiles.length) {
      showFeedback(
        "error",
        "Please select at least one image.",
      );

      return;
    }

    try {
      const response =
        await uploadMediaBulk.mutateAsync({
          files: imageFiles,
        });

      const uploadedImages: ProductImage[] =
        response.map((item) => ({
          imageUrl: item.fileUrl,
          altText:
            item.altText ||
            item.fileName ||
            "Product image",
          isThumbnail: false,
        }));

      setCurrentUrl((previousImages) => {
        const existingUrls = new Set(
          previousImages.map(
            (image) => image.imageUrl,
          ),
        );

        const uniqueUploadedImages =
          uploadedImages.filter(
            (image) =>
              !existingUrls.has(image.imageUrl),
          );

        return [
          ...previousImages,
          ...uniqueUploadedImages,
        ];
      });

      setImageFiles([]);
      setCurrentPage(1);

      showFeedback(
        "success",
        "Images uploaded successfully.",
      );
    } catch (error) {
      showFeedback(
        "error",
        getApiErrorMessage(error),
      );
    }
  };

  const handleToggleImage = (image: MediaAsset) => {
    if (isUploading) {
      return;
    }

    setCurrentUrl((previousImages) => {
      const alreadySelected = previousImages.some(
        (item) => item.imageUrl === image.fileUrl,
      );

      if (alreadySelected) {
        return previousImages.filter(
          (item) =>
            item.imageUrl !== image.fileUrl,
        );
      }

      return [
        ...previousImages,
        {
          imageUrl: image.fileUrl,
          altText:
            image.altText ||
            image.fileName ||
            "Product image",
          isThumbnail: false,
        },
      ];
    });
  };

  const handleUseSelectedImages = () => {
    if (currentUrl.length === 0) {
      showFeedback(
        "error",
        "Please select at least one image.",
      );

      return;
    }

    onSelect(currentUrl);
    onClose();
  };

  const handleClose = () => {
    if (isUploading) {
      return;
    }

    onClose();
  };

  if (!open) {
    return null;
  }

  return (
    <div
      role="presentation"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !isUploading
        ) {
          onClose();
        }
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-3 backdrop-blur-sm sm:p-5"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="multi-image-modal-title"
        className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-gray-200 px-5 py-4 dark:border-gray-700 sm:px-6">
          <div>
            <h2
              id="multi-image-modal-title"
              className="text-lg font-semibold text-gray-900 dark:text-white"
            >
              Select Images
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Upload new images or select from your
              media library.
            </p>
          </div>

          <button
            type="button"
            aria-label="Close modal"
            disabled={isUploading}
            onClick={handleClose}
            className="grid size-10 shrink-0 place-items-center rounded-full border border-gray-200 text-gray-500 transition hover:border-gray-300 hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          {/* Feedback */}
          {feedback && (
            <div
              className={`mb-5 flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
                feedback.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300"
                  : "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300"
              }`}
            >
              {feedback.type === "success" ? (
                <Check className="size-5 shrink-0" />
              ) : (
                <X className="size-5 shrink-0" />
              )}

              <span>{feedback.text}</span>
            </div>
          )}

          {/* Upload section */}
          <section>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              disabled={isUploading}
              onChange={handleFileSelect}
              className="hidden"
            />

            <button
              type="button"
              disabled={isUploading}
              onClick={() =>
                fileInputRef.current?.click()
              }
              className="group flex min-h-40 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50/50 px-6 py-8 text-center transition hover:border-blue-500 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-70 dark:border-blue-800 dark:bg-blue-950/20 dark:hover:border-blue-600 dark:hover:bg-blue-950/35"
            >
              {isUploading ? (
                <>
                  <LoaderCircle className="size-9 animate-spin text-blue-600 dark:text-blue-400" />

                  <span className="mt-3 font-semibold text-gray-900 dark:text-white">
                    Uploading images...
                  </span>

                  <span className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Please keep this window open.
                  </span>
                </>
              ) : (
                <>
                  <span className="grid size-12 place-items-center rounded-full bg-blue-100 text-blue-600 transition group-hover:scale-105 dark:bg-blue-950 dark:text-blue-400">
                    <UploadCloud className="size-6" />
                  </span>

                  <span className="mt-3 font-semibold text-gray-900 dark:text-white">
                    Choose images to upload
                  </span>

                  <span className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Click here to browse multiple image
                    files.
                  </span>
                </>
              )}
            </button>

            {imageFiles.length > 0 && (
              <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Selected files
                    </p>

                    <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                      {imageFiles.length} image
                      {imageFiles.length > 1
                        ? "s"
                        : ""}{" "}
                      ready to upload
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={handleImageBulkUpload}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                  >
                    {isUploading ? (
                      <LoaderCircle className="size-4 animate-spin" />
                    ) : (
                      <UploadCloud className="size-4" />
                    )}

                    Upload Images
                  </button>
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {imageFiles.map((file, index) => (
                    <div
                      key={`${file.name}-${file.size}-${index}`}
                      className="flex min-w-0 items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2.5 dark:border-gray-700 dark:bg-gray-900"
                    >
                      <span className="grid size-9 shrink-0 place-items-center rounded-md bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                        <ImageIcon className="size-4" />
                      </span>

                      <div className="min-w-0 flex-1">
                        <p
                          title={file.name}
                          className="truncate text-sm font-medium text-gray-700 dark:text-gray-200"
                        >
                          {file.name}
                        </p>

                        <p className="text-xs text-gray-400">
                          {(
                            file.size /
                            1024 /
                            1024
                          ).toFixed(2)}{" "}
                          MB
                        </p>
                      </div>

                      <button
                        type="button"
                        aria-label={`Remove ${file.name}`}
                        disabled={isUploading}
                        onClick={() =>
                          handleRemoveFile(index)
                        }
                        className="grid size-8 shrink-0 place-items-center rounded-md text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-red-950/40"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Media library header */}
          <div className="mb-4 mt-7 flex items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Media Library
              </h3>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {currentUrl.length} image
                {currentUrl.length !== 1 ? "s" : ""}{" "}
                selected
              </p>
            </div>

            {isFetching && !isLoading && (
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <RefreshCw className="size-4 animate-spin" />
                Refreshing
              </div>
            )}
          </div>

          {/* Loading */}
          {isLoading ? (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-center dark:border-gray-700 dark:bg-gray-800/40">
              <LoaderCircle className="size-9 animate-spin text-blue-600 dark:text-blue-400" />

              <p className="mt-3 font-medium text-gray-700 dark:text-gray-200">
                Loading images...
              </p>
            </div>
          ) : images.length === 0 ? (
            /* Empty state */
            <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 text-center dark:border-gray-700 dark:bg-gray-800/40">
              <span className="grid size-14 place-items-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800">
                <ImageIcon className="size-7" />
              </span>

              <h4 className="mt-4 font-semibold text-gray-900 dark:text-white">
                No images found
              </h4>

              <p className="mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">
                Upload an image above to add it to your
                media library.
              </p>
            </div>
          ) : (
            /* Image grid */
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {images.map((image) => {
                const isSelected = currentUrl.some(
                  (item) =>
                    item.imageUrl === image.fileUrl,
                );

                const previewUrl = imageUrlSet(
                  image.fileUrl,
                );

                return (
                  <button
                    type="button"
                    key={image.id}
                    disabled={isUploading}
                    onClick={() =>
                      handleToggleImage(image)
                    }
                    className={`group relative overflow-hidden rounded-xl border bg-white text-left transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-gray-900 ${
                      isSelected
                        ? "border-blue-600 ring-2 ring-blue-600/20"
                        : "border-gray-200 hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-md dark:border-gray-700"
                    }`}
                  >
                    <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <Image
                        src={previewUrl}
                        alt={
                          image.altText ||
                          image.fileName ||
                          "Media image"
                        }
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        unoptimized
                      />

                      <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/5" />

                      {isSelected && (
                        <span className="absolute right-2.5 top-2.5 grid size-7 place-items-center rounded-full bg-blue-600 text-white shadow-md">
                          <Check className="size-4" />
                        </span>
                      )}
                    </div>

                    <div className="px-3 py-2.5">
                      <p
                        title={
                          image.fileName ||
                          "Image media"
                        }
                        className="truncate text-sm font-medium text-gray-700 dark:text-gray-200"
                      >
                        {image.fileName ||
                          "Image media"}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 pt-5 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  aria-label="Previous page"
                  disabled={
                    currentPage === 1 ||
                    isUploading ||
                    isFetching
                  }
                  onClick={() =>
                    setCurrentPage(
                      (previousPage) =>
                        previousPage - 1,
                    )
                  }
                  className="grid size-9 place-items-center rounded-lg border border-gray-200 text-gray-600 transition hover:border-blue-500 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300"
                >
                  <ChevronLeft className="size-4" />
                </button>

                {visiblePages.map((pageNumber) => (
                  <button
                    type="button"
                    key={pageNumber}
                    disabled={
                      isUploading || isFetching
                    }
                    onClick={() =>
                      setCurrentPage(pageNumber)
                    }
                    className={`grid size-9 place-items-center rounded-lg border text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                      currentPage === pageNumber
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-gray-200 text-gray-600 hover:border-blue-500 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}

                <button
                  type="button"
                  aria-label="Next page"
                  disabled={
                    currentPage === totalPages ||
                    isUploading ||
                    isFetching
                  }
                  onClick={() =>
                    setCurrentPage(
                      (previousPage) =>
                        previousPage + 1,
                    )
                  }
                  className="grid size-9 place-items-center rounded-lg border border-gray-200 text-gray-600 transition hover:border-blue-500 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-gray-200 bg-gray-50 px-5 py-4 dark:border-gray-700 dark:bg-gray-900 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 sm:text-left">
            {currentUrl.length > 0
              ? `${currentUrl.length} image${
                  currentUrl.length > 1 ? "s" : ""
                } selected`
              : "No images selected"}
          </p>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              disabled={isUploading}
              onClick={handleClose}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-gray-300 bg-white px-5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={
                currentUrl.length === 0 ||
                isUploading
              }
              onClick={handleUseSelectedImages}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400 dark:disabled:bg-blue-900"
            >
              <CirclePlus className="size-4" />
              Use Selected Images
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiImageSelectModal;