type QueryValue = string | number | boolean | null | undefined;

export function buildQueryString(
  query?: Record<string, QueryValue>,
): string {
  if (!query) return "";

  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    params.set(key, String(value));
  });

  const value = params.toString();

  return value ? `?${value}` : "";
}
