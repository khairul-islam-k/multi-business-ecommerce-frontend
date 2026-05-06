"use client";

import React from "react";
import Link from "next/link";
import { Layout, Space, Badge, Button, theme, Grid, Flex } from "antd";
import { BellOutlined, LayoutOutlined, MenuOutlined } from "@ant-design/icons";

import GlobalSearch from "./global-search";
import BusinessDropdown from "./business-owner";
import ProfileDropdown from "./profile-dropdown";
import ThemeToggle from "@/components/shared/antd-theme-toggle";

const { Header } = Layout;

type TopbarProps = {
  toggle: () => void;
  toggleSidebar: () => void;
};

const TopBar: React.FC<TopbarProps> = ({ toggle, toggleSidebar }) => {
  const { token } = theme.useToken();
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  return (
    <>
      <Header
        style={{
          background: token.colorBgBase,
          padding: "8px 16px",
          // boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          height: "auto",
          width: "100%",
          lineHeight: "normal",
        }}
      >
        <Space
          style={{ width: "100%", justifyContent: "space-between" }}
          align="center"
        >
          <Flex style={{ gap: "8px" }} align="center">
            <div
              onClick={toggleSidebar}
              style={{
                display: screens.xs ? "none" : "block",
                cursor: "pointer",
              }}
            >
              <LayoutOutlined style={{ fontSize: "20px" }} />
            </div>

            <GlobalSearch />
          </Flex>

          <Space size="small" align="center">
            <div style={{ display: screens.xs ? "none" : "block" }}>
              <BusinessDropdown />
            </div>

            {/* theme toggle */}
            <ThemeToggle />

            <Link href="/admin/dashboard/notifications">
              <Badge dot>
                <BellOutlined style={{ fontSize: 18 }} />
              </Badge>
            </Link>

            <ProfileDropdown />

            {/* Mobile menu button */}
            <Button
              className="menu-btn"
              type="text"
              icon={<MenuOutlined style={{ fontSize: 20 }} />}
              onClick={toggle}
            />
          </Space>
        </Space>
      </Header>

      <style jsx>{`
        @media (min-width: 768px) {
          :global(.menu-btn) {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default TopBar;
