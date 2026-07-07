"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "../../_components/contex/CartContex";

type AuthGuardProps = {
  children: React.ReactNode;
};

const AuthGuard = ({ children }: AuthGuardProps) => {
  const router = useRouter();
  const { getAuthUser } = useCart();

  const user = getAuthUser();

  console.log('user', user);

  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!user?.refreshToken) {
      router.replace("/store/login");
      return;
    }

    setIsChecking(false);
  }, [router, user?.refreshToken]);

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[var(--store-primary,#f16d59)]" />
          <p className="mt-3 text-sm font-medium text-gray-500">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;