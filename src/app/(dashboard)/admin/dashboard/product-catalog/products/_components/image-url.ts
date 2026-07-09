export const imageUrlSet = (url?: string | null): string => {
  if (!url) return "";

  if (url.startsWith("http")) {
    return url;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  return `${baseUrl}${url}`;
};