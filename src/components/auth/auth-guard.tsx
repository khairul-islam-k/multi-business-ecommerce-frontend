"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/stores/auth.store";
import { message } from "antd";

export default function AuthGuard({
  redirectUrl,
  role,
  children,
}: {
  redirectUrl: string;
  role: "Admin" | "Tenant" | "Employee";
  children: React.ReactNode;
}) {
  const { accessToken, initialized, user, loading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) return;

    // 1. not logged in
    if (!accessToken) {
      message.error("Please login first.");
      router.replace(redirectUrl);
      return;
    }

    // 2. still loading user → WAIT
    if (loading || !user) return;

    // 3. role mismatch
    if (user.user_type !== role) {
      message.error(`You need ${role} access.`);
      router.replace(redirectUrl);
      return;
    }
  }, [initialized, accessToken, user, loading]);
  // prevent flicker before init
  if (!initialized) return null;

  if (!accessToken) return null;

  return <>{children}</>;
}
