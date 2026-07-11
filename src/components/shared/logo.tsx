"use client";

import Image from "next/image";
import Link from "next/link";
import { theme } from "antd";

import { useActiveBusinessId } from "@/hooks/use-active-business";
import { useBusiness } from "@/lib/api";
import { cn } from "@/lib/utils";

interface LogoProps {
  collapsed?: boolean;
  className?: string;
  white?: boolean;
}

const resolveAssetUrl = (url?: string | null) => {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  return baseUrl ? `${baseUrl}${url}` : url;
};

export default function Logo({ collapsed = false, className = "" }: LogoProps) {
  const { token } = theme.useToken();
  const businessId = useActiveBusinessId();
  const { data: business } = useBusiness(businessId);
  const logoUrl = resolveAssetUrl(business?.branding?.logoUrl);
  const brandName = business?.branding?.seoTitle ?? business?.name ?? "Onecomm";
  const initials = brandName.trim().charAt(0).toUpperCase() || "O";

  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2.5 shrink-0", className)}
    >
      <div
        className="grid h-10 w-10 place-items-center overflow-hidden font-display text-lg font-extrabold"
        style={{
          borderRadius: token.borderRadiusLG,
          background: logoUrl ? "transparent" : token.colorPrimary,
          color: token.colorTextLightSolid,
          border: logoUrl ? "none" : `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={`${brandName} logo`}
            width={40}
            height={40}
            className="h-full w-full object-contain"
            unoptimized
          />
        ) : (
          initials
        )}
      </div>
      {!collapsed && (
        <span
          className="truncate font-display text-2xl font-bold tracking-tight"
          style={{ color: token.colorText }}
        >
          {brandName}
        </span>
      )}
    </Link>
  );
}
