"use client";

import React from "react";
import Link from "next/link";
import { Layout, Menu, theme } from "antd";
import type { MenuProps } from "antd";
import {
    AppstoreAddOutlined,
    AppstoreOutlined,
    ArrowUpOutlined,
    CreditCardOutlined,
    DashboardOutlined,
    FileTextOutlined,
    HistoryOutlined,
    ProfileOutlined,
    SettingOutlined,
    SyncOutlined,
    TeamOutlined,
} from "@ant-design/icons";
import Logo from "@/components/shared/logo";

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
                    label: <Link href="/admin/dashboard/business/settings">Settings</Link>,
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
        </Sider>
    );
};

export default Sidebar;