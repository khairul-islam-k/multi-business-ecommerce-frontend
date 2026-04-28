"use client";

import React, { useState } from "react";
import { Input, Button, Space } from "antd";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons";

const GlobalSearch = () => {
    const [open, setOpen] = useState(false);

  return (
    <>
      <Space align="center">
        {/* Desktop search (always visible) */}
        <div className="desktop-search">
          <Input
            placeholder="Search..."
            prefix={<SearchOutlined />}
            allowClear
            style={{ width: 220 }}
          />
        </div>

        {/* Mobile search */}
        <div className="mobile-search">
          {!open ? (
            <Button
              type="text"
              icon={<SearchOutlined style={{ fontSize: 18 }} />}
              onClick={() => setOpen(true)}
            />
          ) : (
            <Space>
              <Input
                autoFocus
                placeholder="Search..."
                allowClear
                prefix={<SearchOutlined />}
                style={{ width: 180 }}
                onBlur={() => setOpen(false)}
              />
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={() => setOpen(false)}
              />
            </Space>
          )}
        </div>
      </Space>

      <style jsx>{`
        /* Mobile */
        .desktop-search {
          display: none;
        }

        /* Desktop */
        @media (min-width: 768px) {
          .desktop-search {
            display: block;
          }

          .mobile-search {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default GlobalSearch;