"use client";
import React from "react";
import { Grid, Menu, theme } from "antd";
import Logo from "@/components/shared/logo";
import BusinessDropdown from "./business-owner";
import { items } from "./side-navigation";

type SidebarProps = {
  close?: () => void;
  collapsed?: boolean;
};

const Sidebar: React.FC<SidebarProps> = ({ close, collapsed }) => {
  const { token } = theme.useToken();

  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  return (
    <div
      style={{
        background: token.colorBgBase,
        overflow: "auto",
        height: "100vh",
      }}
    >
      {/* Logo */}
      <div
        style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: `1px solid ${token.colorBorder}`,
        }}
      >
        <Logo collapsed={collapsed} />
      </div>

      {/* Menu */}
      <Menu
        mode="inline"
        inlineCollapsed={collapsed}
        items={items}
        onClick={close}
        style={{ borderRight: 0 }}
      />

      <div
        style={{
          display: screens.xs ? "flex" : "none",
          alignItems: "center",
          justifyContent: "center",
          borderTop: `1px solid ${token.colorBorder}`,
          paddingTop: 20,
        }}
      >
        <BusinessDropdown />
      </div>
    </div>
  );
};

export default Sidebar;
