"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/stores/auth.store";

export default function AuthGuard({
  redirectUrl,
  children,
}: {
  redirectUrl: string;
  children: React.ReactNode;
}) {
  const { accessToken, initialized } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (initialized && !accessToken) {
      router.replace(redirectUrl);
    }
  }, [initialized, accessToken, router]);

  // prevent flicker before init
  if (!initialized) return null;

  if (!accessToken) return null;

  return <>{children}</>;
}
