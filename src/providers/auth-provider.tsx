"use client";

import React, { useEffect } from "react";

import { useAuthStore } from "@/stores/auth.store";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const init = useAuthStore((s) => s.init);

  useEffect(() => {
    init();
  }, [init]);

  return <>{children}</>;
}
