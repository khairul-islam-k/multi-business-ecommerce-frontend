import type { MediaAsset } from "@/lib/api";

const apiOrigin = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_API_BASE_URL ?? "").origin;
  } catch {
    return "";
  }
})();

export function mediaUrl(asset: MediaAsset) {
  const value = asset.fileUrl;

  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("/")) return `${apiOrigin}${value}`;

  return value;
}

export function formatFileSize(size?: number | null) {
  if (!size) return "Unknown size";

  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;

  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

export function fileName(asset: MediaAsset) {
  return asset.fileName;
}
