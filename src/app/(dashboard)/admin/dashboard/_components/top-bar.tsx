"use client";

import { Button, Flex, Grid, Space, theme, Tooltip } from "antd";
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
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: screens.xs ? "0 10px" : "0 18px",
          boxSizing: "border-box",
          height: 64,
          width: "100%",
          lineHeight: "normal",
        }}
      >
        {/* Left side */}
        <Flex
          align="center"
          style={{
            gap: 12,
            minWidth: 0,
            height: "100%",
          }}
        >
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
              display: screens.xs ? "none" : "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              padding: 0,
            }}
          />

          {/* <GlobalSearch /> */}
        </Flex>

        {/* Right side */}
        <Flex
          align="center"
          justify="flex-end"
          style={{
            gap: screens.xs ? 4 : 10,
            height: "100%",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: screens.xs ? "none" : "flex",
              alignItems: "center",
              height: 40,
            }}
          >
            <BusinessDropdown />
          </div>

          <Tooltip title='Pos'>
            <Link
              href="/admin/dashboard/pos"
              aria-label="Open POS"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-black/5 dark:hover:bg-white/10"
              style={{
                color: "var(--dashboard-header-text-color)",
              }}
            >
              <ShoppingCart size={20} />
            </Link>
          </Tooltip>

          <div className="flex h-10 shrink-0 items-center">
            <ProfileDropdown />
          </div>

          {/* Mobile menu button */}
          <Button
            type="text"
            aria-label="Open mobile menu"
            icon={<Menu size={20} />}
            onClick={toggle}
            style={{
              display: screens.md ? "none" : "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              padding: 0,
            }}
          />
        </Flex>
      </div>
    </>
  );
};

export default TopBar;
