"use client";

import React from "react";
import Link from "next/link";
import { Layout, Menu, theme } from "antd";
import type { MenuProps } from "antd";
import {
    AppstoreOutlined,
    DashboardOutlined,
    FileTextOutlined,
    ProfileOutlined,
    SettingOutlined,
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
            key: "business-owner",
            icon: <TeamOutlined />,
            label: "Business Owner",
            children: [
                {
                    key: "business-profile",
                    icon: <ProfileOutlined />,
                    label: <Link href="/admin/dashboard/business/profile">Business Profile</Link>,
                },
                {
                    key: "business-branding",
                    icon: <AppstoreOutlined />,
                    label: <Link href="/admin/dashboard/business/branding">Business Branding</Link>,
                },
                {
                    key: "business-settings",
                    icon: <SettingOutlined />,
                    label: <Link href="/admin/dashboard/business/settings">Business Settings</Link>,
                },
                {
                    key: "usage-limit",
                    icon: <FileTextOutlined />,
                    label: <Link href="/admin/dashboard/business/usageLimit">Usage & Limit</Link>,
                },
            ],
        },
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