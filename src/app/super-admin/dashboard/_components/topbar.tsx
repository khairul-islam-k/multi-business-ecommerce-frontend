"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Button, Dropdown, Avatar, Badge, MenuProps, theme } from "antd";
import {
  BellOutlined,
  MenuOutlined,
  SearchOutlined,
  CloseOutlined,
  LogoutOutlined,
  UserOutlined,
  SettingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";

import cn from "@/lib/cn";
import ThemeToggle from "@/components/shared/theme-toggle";

const { Search } = Input;
const { useToken } = theme;

interface TopbarProps {
  onMobileMenuToggle: () => void;
  onSidebarToggle: () => void;
}

export default function Topbar({
  onMobileMenuToggle,
  onSidebarToggle,
}: TopbarProps) {
  const router = useRouter();
  const { token } = useToken();

  const [search, setSearch] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const logout = () => {};

  const items: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
      onClick: () => router.push("/super-admin/dashboard/settings"),
    },
    {
      key: "account",
      icon: <SettingOutlined />,
      label: "Account Settings",
      onClick: () => router.push("/super-admin/dashboard/settings"),
    },
    { type: "divider" },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: logout,
    },
  ];

  return (
    <div className="flex items-center w-full gap-3 p-2 sm:p-4">
      {/* Mobile menu button */}
      <div className="md:hidden">
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={onMobileMenuToggle}
        />
      </div>

      {/* Desktop search */}
      <div className="hidden md:flex items-center flex-1 max-w-md gap-3">
        <div className="hidden md:block">
          <Button
            type="text"
            onClick={() => {
              setCollapsed(!collapsed);
              onSidebarToggle();
            }}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          />
        </div>

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
        <ThemeToggle />

        {/* Profile dropdown */}
        <Dropdown menu={{ items }} trigger={["click"]}>
          <div
            className={cn(
              "flex items-center gap-2 cursor-pointer rounded-full border",
              `border-[${token.colorPrimary}]`,
            )}
          >
            <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=utshomh" />
          </div>
        </Dropdown>
      </div>
    </div>
  );
}
