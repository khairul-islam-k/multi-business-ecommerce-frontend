"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  Flex,
  Grid,
  Input,
  MenuProps,
  Space,
  theme,
} from "antd";
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

import { useSwal } from "@/hooks/use-swal";
import { useAuthStore } from "@/stores/auth.store";
import ThemeToggle from "@/components/shared/antd-theme-toggle";
import { getUserAvatarSeed, getUserAvatarUrl } from "@/lib/auth/avatar";

const { Search } = Input;
const { useToken } = theme;

interface TopbarProps {
  collapsed: boolean;
  onMobileMenuToggle: () => void;
  onSidebarToggle: () => void;
}

export default function Topbar({
  collapsed,
  onMobileMenuToggle,
  onSidebarToggle,
}: TopbarProps) {
  const router = useRouter();
  const swal = useSwal();
  const { token } = useToken();
  const screens = Grid.useBreakpoint();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  const [search, setSearch] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const avatarSeed = getUserAvatarSeed(user, "super-admin");
  const avatarSrc = getUserAvatarUrl(user, "super-admin");

  const handleLogout = async () => {
    const { isConfirmed } = await swal.confirm({
      title: "Log out?",
      text: "You will need to sign in again to continue.",
      confirmButtonText: "Log out",
    });

    if (!isConfirmed) return;

    await logout();
    swal.success("Logged out successfully.");
    router.push("/sign-in");
  };

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
      onClick: handleLogout,
    },
  ];

  return (
    <div
      style={{
        alignItems: "center",
        background: token.colorBgContainer,
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        boxSizing: "border-box",
        display: "flex",
        gap: 12,
        height: "100%",
        minHeight: 64,
        padding: screens.xs ? "0 10px" : "0 18px",
        width: "100%",
      }}
    >
      <div className="md:hidden">
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={onMobileMenuToggle}
        />
      </div>

      <Flex className="hidden md:flex" align="center" gap={12} flex="1 1 auto">
        <div>
          <Button
            type="text"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={onSidebarToggle}
            icon={
              collapsed ? (
                <MenuUnfoldOutlined
                  style={{
                    fontSize: 20,
                  }}
                />
              ) : (
                <MenuFoldOutlined
                  style={{
                    fontSize: 20,
                  }}
                />
              )
            }
          />
        </div>

        <Search
          placeholder="Search tenants, packages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          style={{
            maxWidth: 320,
          }}
        />
      </Flex>

      <Space size={screens.xs ? 4 : 8} align="center" className="ml-auto">
        <div className="md:hidden flex items-center">
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

        <ThemeToggle />

        <Dropdown menu={{ items }} trigger={["click"]}>
          <div
            className="flex cursor-pointer items-center gap-2 rounded-full border"
            style={{ borderColor: token.colorPrimary }}
          >
            <Avatar alt={avatarSeed} src={avatarSrc} />
          </div>
        </Dropdown>
      </Space>
    </div>
  );
}
