"use client";

import {
  Search,
  X
} from "lucide-react";


import React, { useState } from "react";
import { Input, Button, Space, theme } from "antd";

const GlobalSearch = () => {
  const [open, setOpen] = useState(false);
  const { token } = theme.useToken();
  const inputStyle: React.CSSProperties = {
    background: token.colorBgContainer,
    borderColor: token.colorBorder,
    color: token.colorText,
  };
  const prefix = <Search style={{ color: token.colorTextTertiary }} />;

  return (
    <>
      <Space align="center">
        {/* Desktop search (always visible) */}
        <div className="desktop-search">
          <Input
            placeholder="Search..."
            prefix={prefix}
            allowClear
            style={{ maxWidth: 320, ...inputStyle }}
          />
        </div>

        {/* Mobile search */}
        <div className="mobile-search">
          {!open ? (
            <Button
              type="text"
              icon={
                <Search
                  style={{ color: token.colorText, fontSize: 18 }}
                />
              }
              onClick={() => setOpen(true)}
            />
          ) : (
            <Space>
              <Input
                autoFocus
                placeholder="Search..."
                allowClear
                prefix={prefix}
                style={{ width: 180, ...inputStyle }}
                onBlur={() => setOpen(false)}
              />
              <Button
                type="text"
                icon={<X />}
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
