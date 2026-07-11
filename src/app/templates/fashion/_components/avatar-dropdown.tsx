"use client";

import { useCart } from "@/app/store/_components/contex/CartContex";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  accessToken: string;
  refreshToken: string;
};

export default function AvatarDropdown() {
  const [open, setOpen] = useState(false);

  const { user, handleLogout, newAccessToken } = useCart();

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!user) {
    return null;
  }

  const handleRefresh = async () => {
    const token = await newAccessToken();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-3 rounded-full border border-gray-200 px-2 py-1.5 shadow-sm transition hover:bg-gray-50"
      >
        <div className="relative size-9 overflow-hidden rounded-full bg-gray-100">
          <Image
            src="https://ui-avatars.com/api/?name=User&background=e5e7eb&color=374151&size=128"
            alt={user.name}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
          <div className="border-b border-gray-100 px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="relative size-12 overflow-hidden rounded-full bg-gray-100">
                <Image
                  src="https://ui-avatars.com/api/?name=User&background=e5e7eb&color=374151&size=128"
                  alt={user.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {user.name}
                </p>
                <p className="truncate text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="py-2">
            <Link
              href="/store/profile"
              className="block px-4 py-2.5 text-sm text-gray-700 transition hover:bg-gray-100"
            >
              My Profile
            </Link>

            <Link
              href="/store/dashboard"
              className="block px-4 py-2.5 text-sm text-gray-700 transition hover:bg-gray-100"
            >
              Dashboard
            </Link>

            <a
              href="/settings"
              className="block px-4 py-2.5 text-sm text-gray-700 transition hover:bg-gray-100"
            >
              Settings
            </a>
          </div>

          <div className="border-t border-gray-100 p-2">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-xl px-4 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
