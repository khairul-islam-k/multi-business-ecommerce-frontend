"use client";

import { useState } from "react";
import type { MenuProps } from "antd";
import { useRouter } from "next/navigation";
import { Input, Button, Dropdown, Avatar, Badge } from "antd";
import {
  BellOutlined,
  MoonOutlined,
  SunOutlined,
  MenuOutlined,
  SearchOutlined,
  CloseOutlined,
} from "@ant-design/icons";

import { useTheme } from "@/providers/theme-provider";

const { Search } = Input;

interface TopbarProps {
  onMobileMenuToggle: () => void;
}

export default function Topbar({ onMobileMenuToggle }: TopbarProps) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const [search, setSearch] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const logout = () => {};

  const items: MenuProps["items"] = [
    {
      key: "profile",
      label: "Profile",
      onClick: () => router.push("/super-admin/dashboard/settings"),
    },
    {
      key: "account",
      label: "Account Settings",
      onClick: () => router.push("/super-admin/dashboard/settings"),
    },
    { type: "divider" },
    {
      key: "logout",
      label: "Logout",
      onClick: logout,
    },
  ];

  return (
    <div className="flex items-center w-full gap-3">
      {/* Mobile menu button */}
      <div className="md:hidden">
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={onMobileMenuToggle}
        />
      </div>

      {/* Desktop search */}
      <div className="hidden md:flex flex-1 max-w-md">
        <Search
          placeholder="Search tenants, packages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
        />
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-1 ml-auto">
        {/* Mobile search */}
        <div className="md:hidden flex items-center ml-auto">
          {!mobileSearchOpen && (
            <Button
              type="text"
              icon={<SearchOutlined />}
              onClick={() => setMobileSearchOpen(true)}
            />
          )}

          {mobileSearchOpen && (
            <div className="flex items-center gap-2 w-full">
              <Input
                autoFocus
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={() => setMobileSearchOpen(false)}
              />
            </div>
          )}
        </div>

        {/* Notifications */}
        <Badge dot>
          <Button
            type="text"
            icon={<BellOutlined />}
            onClick={() => router.push("/super-admin/dashboard/notifications")}
          />
        </Badge>

        {/* Theme toggle */}
        <Button
          type="text"
          icon={theme === "dark" ? <SunOutlined /> : <MoonOutlined />}
          onClick={toggleTheme}
        />

        {/* Profile dropdown */}
        <Dropdown menu={{ items }} trigger={["click"]}>
          <div className="flex items-center gap-2 cursor-pointer">
            <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=johndoe" />
          </div>
        </Dropdown>
      </div>
    </div>
  );
}
