"use client";

import React from "react";
import { Layout, Space, Badge, Avatar, Button, theme } from "antd";
import { BellOutlined, MenuOutlined } from "@ant-design/icons";
import Image from "next/image";
import GlobalSearch from "./GlobalSearch";
import BusinessDropdown from "./BusinessDropdown";

const { Header } = Layout;

type TopbarProps = {
  toggle: () => void;
};

const TopBar: React.FC<TopbarProps> = ({ toggle }) => {
    const { token } = theme.useToken();
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
          <div>
            <GlobalSearch />
          </div>

          <Space size="small" align="center">
            <BusinessDropdown />
            <Badge dot>
              <BellOutlined style={{ fontSize: 18 }} />
            </Badge>

            <Avatar
              size={30}
              src={
                <Image
                  src="/github-logo.jpeg"
                  width={30}
                  height={30}
                  alt="profile"
                />
              }
            />

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