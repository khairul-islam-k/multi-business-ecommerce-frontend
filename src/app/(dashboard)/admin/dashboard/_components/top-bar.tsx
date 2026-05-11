"use client";

import React from "react";
import { Space, Button, theme, Grid, Flex } from "antd";
import {
  MenuFoldOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";

import GlobalSearch from "./global-search";
import BusinessDropdown from "./business-owner";
import ProfileDropdown from "./profile-dropdown";
import ThemeToggle from "@/components/shared/antd-theme-toggle";

type TopbarProps = {
  collapsed?: boolean;
  toggle: () => void;
  toggleSidebar: () => void;
};

const TopBar: React.FC<TopbarProps> = ({
  collapsed,
  toggle,
  toggleSidebar,
}) => {
  const { token } = theme.useToken();
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  return (
    <>
      <div
        style={{
          background: token.colorBgContainer,
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          boxShadow: "none",
          display: "flex",
          alignItems: "center",
          padding: screens.xs ? "0 10px" : "0 18px",
          boxSizing: "border-box",
          height: "100%",
          minHeight: 64,
          width: "100%",
          lineHeight: "normal",
        }}
      >
        <Space
          style={{ width: "100%", justifyContent: "space-between" }}
          align="center"
        >
          <Flex style={{ gap: 12, minWidth: 0 }} align="center">
            <Button
              type="text"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              icon={
                collapsed ? (
                  <MenuUnfoldOutlined style={{ fontSize: 20 }} />
                ) : (
                  <MenuFoldOutlined style={{ fontSize: 20 }} />
                )
              }
              onClick={toggleSidebar}
              style={{
                display: screens.xs ? "none" : "block",
              }}
            />

            <GlobalSearch />
          </Flex>

          <Space size={screens.xs ? 4 : 8} align="center">
            <ThemeToggle />

            <div style={{ display: screens.xs ? "none" : "block" }}>
              <BusinessDropdown />
            </div>

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
      </div>

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
