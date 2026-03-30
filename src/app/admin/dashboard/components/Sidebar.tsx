"use client";

import React from "react";
import Link from "next/link";
import { Grid, Layout, Menu, theme } from "antd";
import type { MenuProps } from "antd";
import {
    AppstoreAddOutlined,
    AppstoreOutlined,
    ArrowUpOutlined,
    CreditCardOutlined,
    DashboardOutlined,
    FileTextOutlined,
    HistoryOutlined,
    HomeOutlined,
    IdcardOutlined,
    ProfileOutlined,
    SettingOutlined,
    ShopOutlined,
    SyncOutlined,
    TagsOutlined,
    TeamOutlined,
} from "@ant-design/icons";
import Logo from "@/components/shared/logo";
import BusinessDropdown from "./BusinessDropdown";

const { Sider } = Layout;

type SidebarProps = {
    close?: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ close }) => {
    const items: MenuProps["items"] = [
        {
            key: "dashboard",
            icon: <DashboardOutlined />,
            label: <Link href="/admin/dashboard">Dashboard</Link>,
        },
        {
            key: "Category-List",
            icon: <AppstoreOutlined />,
            label: <Link href="/admin/dashboard/categoryList">Category List</Link>,
        },
        {
            key: "Brand-list",
            icon: <TagsOutlined />,
            label: <Link href="/admin/dashboard/brandList">Brand List</Link>,
        },
        {
            key: "Warehouse-list",
            icon: <HomeOutlined />,
            label: <Link href="/admin/dashboard/warehouseList">Warehouse List</Link>,
        },
        {
            key: "Showroom-list",
            icon: <ShopOutlined />,
            label: <Link href="/admin/dashboard/showroomList">Showroom List</Link>,
        },
        {
            key: "Supplier-list",
            icon: <TeamOutlined />,
            label: <Link href="/admin/dashboard/supplierList">Supplier List</Link>,
        },
        {
            key: "Supplier-details",
            icon: <IdcardOutlined />,
            label: <Link href="/admin/dashboard/supplierDetails">Supplier Details</Link>,
        },
        {
            key: "business",
            icon: <TeamOutlined />,
            label: "Business",
            children: [
                {
                    key: "profile",
                    icon: <ProfileOutlined />,
                    label: <Link href="/admin/dashboard/business/profile">Profile</Link>,
                },
                {
                    key: "branding",
                    icon: <AppstoreOutlined />,
                    label: <Link href="/admin/dashboard/business/branding">Branding</Link>,
                },
                {
                    key: "settings",
                    icon: <SettingOutlined />,
                    label: <Link href="/admin/dashboard/business/setting">Settings</Link>,
                },
                {
                    key: "usage-limit",
                    icon: <FileTextOutlined />,
                    label: <Link href="/admin/dashboard/business/usageLimit">Usage & Limit</Link>,
                },
            ],
        },
        {
            key: "billing",
            icon: <CreditCardOutlined />, // Billing / Payments
            label: "Billing",
            children: [
                {
                    key: "addons",
                    icon: <AppstoreAddOutlined />, // Add-ons / extras
                    label: <Link href="/admin/dashboard/billing/addons">Addons</Link>,
                },
                {
                    key: "history",
                    icon: <HistoryOutlined />, // Payment / invoice history
                    label: <Link href="/admin/dashboard/billing/history">History</Link>,
                },
                {
                    key: "subscription",
                    icon: <SyncOutlined />, // Subscription / recurring
                    label: <Link href="/admin/dashboard/billing/subscription">Subscription</Link>,
                },
                {
                    key: "upgrade-plan",
                    icon: <ArrowUpOutlined />, // Upgrade
                    label: <Link href="/admin/dashboard/billing/upgrade-plan">Upgrade Plan</Link>,
                },
            ],
        }
    ];

    const { token } = theme.useToken();

    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();


    return (
        <Sider
            width={260}
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
                    borderBottom: `1px solid ${token.colorBorder}`
                }}
            >
                <Logo />
            </div>

            {/* Menu */}
            <Menu
                mode="inline"
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
                    paddingTop: 20
                }}
            >
                <BusinessDropdown />
            </div>
        </Sider>
    );
};

export default Sidebar;