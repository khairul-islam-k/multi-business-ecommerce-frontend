"use client";

import { Button, Flex, Grid, Space, theme } from "antd";
import { Menu, PanelLeftClose, PanelLeftOpen, ShoppingCart } from "lucide-react";
import React from "react";

import BusinessDropdown from "./business-owner";
import ProfileDropdown from "./profile-dropdown";
import Link from "next/link";

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
          background: "var(--dashboard-header-background-color)",
          color: "var(--dashboard-header-text-color)",
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
                  <PanelLeftOpen size={20} />
                ) : (
                  <PanelLeftClose size={20} />
                )
              }
              onClick={toggleSidebar}
              style={{
                display: screens.xs ? "none" : "block",
              }}
            />

            {/* <GlobalSearch /> */}
          </Flex>

          <Space size={screens.xs ? 4 : 8} align="center">
            <Link
            className="lg:mr-5"
            href='/admin/dashboard/pos'>
              <ShoppingCart />
            </Link>

            <div style={{ display: screens.xs ? "none" : "block" }}>
              <BusinessDropdown />
            </div>

            <ProfileDropdown />

            {/* Mobile menu button */}
            <Button
              style={{
                display: screens.md ? "none" : "inline-flex",
              }}
              type="text"
              icon={<Menu size={20} />}
              onClick={toggle}
            />
          </Space>
        </Space>
      </div>
    </>
  );
};

export default TopBar;
