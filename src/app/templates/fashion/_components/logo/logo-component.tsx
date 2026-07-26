"use client";

import Image from "next/image";
import Link from "next/link";

import { imageUrlSet } from "@/app/(dashboard)/admin/dashboard/product-catalog/products/_components/image-url";
import { useResolveWebsite } from "@/lib/api/hooks/template-resolve";

type LogoProps = {
  sidebarCollapsed?: boolean;
  textColor?: string;
};

const LogoComponent = ({
  sidebarCollapsed = false,
  textColor,
}: LogoProps) => {
  const { data: resolve } = useResolveWebsite();

  const fullName = resolve?.name?.trim() || "Store";

  const firstLetter =
    fullName.charAt(0).toUpperCase() || "S";

  const logoUrl =
    resolve?.theme?.logoUrl?.trim() || "";

  const logoSrc = logoUrl
    ? imageUrlSet(logoUrl)
    : "";

  return (
    <Link
      href="/store"
      aria-label={`${fullName} home`}
      className="inline-flex min-w-0 items-center"
    >
      {logoSrc ? (
        <Image
          src={logoSrc}
          width={200}
          height={50}
          alt={`${fullName} logo`}
          priority
          className="h-[45px] w-[200px] object-contain"
          style={{
            filter: "none",
          }}
          onError={(event) => {
            console.error(
              "Logo failed to load:",
              logoSrc,
              event,
            );
          }}
        />
      ) : (
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gray-900 font-semibold text-white">
            {firstLetter}
          </div>

          {!sidebarCollapsed && (
            <span
              title={fullName}
              className="block max-w-[160px] truncate whitespace-nowrap text-lg font-bold"
              style={{
                color:
                  textColor ||
                  "var(--store-text-primary)",
              }}
            >
              {fullName}
            </span>
          )}
        </div>
      )}
    </Link>
  );
};

export default LogoComponent;