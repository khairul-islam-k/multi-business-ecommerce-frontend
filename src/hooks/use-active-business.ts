"use client";

import { useMemo } from "react";

import { useAuthStore } from "@/stores/auth.store";

export function useActiveBusinessId() {
  const selectedBusiness = useAuthStore((state) => state.selectedBusiness);
  const businesses = useAuthStore((state) => state.businesses);

  return useMemo(
    () => selectedBusiness?.id ?? businesses[0]?.id ?? null,
    [businesses, selectedBusiness?.id],
  );
}
