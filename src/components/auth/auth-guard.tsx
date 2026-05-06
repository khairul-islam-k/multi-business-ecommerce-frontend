"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useSwal } from "@/hooks/use-swal";
import { useAuthStore } from "@/stores/auth.store";

export default function AuthGuard({
  redirectUrl,
  role,
  children,
}: {
  redirectUrl: string;
  role: "Admin" | "Tenant" | "Employee";
  children: React.ReactNode;
}) {
  const swal = useSwal();
  const router = useRouter();
  const { accessToken, initialized, user, loading } = useAuthStore();

  // useEffect(() => {
  //   if (!initialized) return;

  //   if (!accessToken) {
  //     swal.error("Please login first.");
  //     router.replace(redirectUrl);
  //     return;
  //   }

  //   if (loading || !user) return;

  //   if (user.user_type !== role) {
  //     swal.error(`You need ${role} access.`);
  //     router.replace(redirectUrl);
  //     return;
  //   }
  // }, [initialized, accessToken, user, loading]);
  // if (!initialized) return null;

  // if (!accessToken) return null;

  return <>{children}</>;
}
