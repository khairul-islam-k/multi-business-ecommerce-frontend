"use client";

import React, { useMemo } from "react";
import { Grid, Menu, Spin, theme } from "antd";
import type { MenuProps } from "antd";

import { items } from "./side-navigation";
import Logo from "@/components/shared/logo";
import BusinessDropdown from "./business-owner";
import { useAuthStore } from "@/stores/auth.store";
import { usePermissionAccess } from "@/hooks/use-permission-access";
import { PERMISSIONS } from "@/lib/auth/permissions";

type SidebarProps = {
  close?: () => void;
  collapsed?: boolean;
};

type MenuItem = NonNullable<MenuProps["items"]>[number];
type MenuItemWithChildren = MenuItem & {
  key?: React.Key;
  children?: MenuItemWithChildren[];
};

const itemKey = (item: MenuItem | null | undefined) =>
  item && "key" in item && item.key != null ? String(item.key) : null;

const Sidebar: React.FC<SidebarProps> = ({ close, collapsed }) => {
  const { token } = theme.useToken();
  const userType = useAuthStore((state) => state.user?.type);
  const businessAccess = usePermissionAccess(PERMISSIONS.businessRead);
  const employeeAccess = usePermissionAccess(PERMISSIONS.employeeRead);
  const mediaAccess = usePermissionAccess(PERMISSIONS.mediaRead);
  const packageAccess = usePermissionAccess(PERMISSIONS.packageRead);
  const roleAccess = usePermissionAccess(PERMISSIONS.roleRead);
  const productCatalogAccess = usePermissionAccess(PERMISSIONS.productCatalogRead);
  const posAccess = usePermissionAccess(PERMISSIONS.posCreate);
  const supplierAccess = usePermissionAccess(PERMISSIONS.supplierRead);
  const inventoryAccess = usePermissionAccess(PERMISSIONS.inventoryRead);
  const orderAccess = usePermissionAccess(PERMISSIONS.orderRead);
  const financeAccess = usePermissionAccess(PERMISSIONS.financeRead);
  const websiteAccess = usePermissionAccess(PERMISSIONS.websiteRead);
  const courierAccess = usePermissionAccess(PERMISSIONS.courierRead);

  const loading = businessAccess.loading;

  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const menuItems = useMemo(() => {
    if (userType !== "EMPLOYEE") return items;

    const employeeMenuItems = (items ?? [])
      .map((item) => {
        const key = itemKey(item);

        if (key === "dashboard") return item;
        if (key === "pos") return posAccess.allowed ? item : null;
        if (key === "business") return businessAccess.allowed ? item : null;
        if (key === "media") return mediaAccess.allowed ? item : null;
        if (key === "billing") return packageAccess.allowed ? item : null;
        if (key === "inventory") return inventoryAccess.allowed ? item : null;
        if (key === "couriers") return courierAccess.allowed ? item : null;
        if (key === "suppliers-procurement") {
          return supplierAccess.allowed ? item : null;
        }
        if (key === "orders" || key === "customers") {
          return orderAccess.allowed ? item : null;
        }
        if (key === "finance-account") {
          return financeAccess.allowed ? item : null;
        }
        if (key === "website-builder") {
          return websiteAccess.allowed ? item : null;
        }

        if (key === "access-control") {
          const children = (
            (item as MenuItemWithChildren).children ?? []
          ).filter((child) => {
            const childKey = itemKey(child);

            if (childKey === "employees") return employeeAccess.allowed;
            if (childKey === "roles" || childKey === "permissions") {
              return roleAccess.allowed;
            }

            return false;
          });

          if (!children.length) return null;

          return {
            ...(item as MenuItemWithChildren),
            children,
          };
        }

        if (key === "product-catalog") {
          return productCatalogAccess.allowed ? item : null;
        }

        return null;
      })
      .filter(Boolean) as MenuProps["items"];

    return employeeMenuItems;
  }, [
    businessAccess.allowed,
    employeeAccess.allowed,
    mediaAccess.allowed,
    financeAccess.allowed,
    inventoryAccess.allowed,
    orderAccess.allowed,
    packageAccess.allowed,
    posAccess.allowed,
    productCatalogAccess.allowed,
    roleAccess.allowed,
    supplierAccess.allowed,
    userType,
    websiteAccess.allowed,
    courierAccess.allowed
  ]);

  const primaryMenuItems = useMemo(
    () => (menuItems ?? []).filter((item) => itemKey(item) !== "notifications"),
    [menuItems],
  );

  const notificationMenuItems = useMemo(
    () => (menuItems ?? []).filter((item) => itemKey(item) === "notifications"),
    [menuItems],
  );


  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  return (
    <div
      style={{
        background: "var(--dashboard-sidebar-background-color)",
        color: "var(--dashboard-sidebar-text-color)",
        borderRight: `1px solid ${token.colorBorderSecondary}`,
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <div
        style={{
          boxSizing: "border-box",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          flexShrink: 0,
        }}
      >
        <Logo collapsed={collapsed} />
      </div>

      <div style={{ flex: 1, overflow: "auto", paddingBlock: 8 }}>
        <Menu
          mode="inline"
          inlineCollapsed={collapsed}
          items={primaryMenuItems}
          onClick={close}
          style={{
            borderRight: 0,
            background: "transparent",
            color: "var(--dashboard-sidebar-text-color)",
          }}
        />
      </div>

      <div
        style={{
          borderTop: `1px solid ${token.colorBorderSecondary}`,
          paddingBlock: 8,
          flexShrink: 0,
        }}
      >
        <Menu
          mode="inline"
          inlineCollapsed={collapsed}
          items={notificationMenuItems}
          onClick={close}
          style={{
            borderRight: 0,
            background: "transparent",
            color: "var(--dashboard-sidebar-text-color)",
          }}
        />
      </div>

      <div
        style={{
          display: screens.xs ? "flex" : "none",
          alignItems: "center",
          justifyContent: "center",
          borderTop: `1px solid ${token.colorBorderSecondary}`,
          padding: 12,
          flexShrink: 0,
        }}
      >
        <BusinessDropdown />
      </div>
    </div>
  );
};

export default Sidebar;
