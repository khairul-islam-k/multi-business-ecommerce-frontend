"use client";

import React from "react";
import { Avatar, Button, Dropdown, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";

const companies = ["Google", "Microsoft", "Apple", "Amazon", "Meta"];

const BusinessDropdown = () => {

    const handleMenuClick = (e: { key: string }) => {
        console.log("Selected Company:", e.key);
    }

    return (
        <Dropdown
            menu={{
                items: [
                    ...companies.map((company) => ({
                        key: company,
                        label: <Space>
                            <Avatar size="small">{company.charAt(0)}</Avatar>
                            {company}
                        </Space>
                    })),
                    {
                        type: "divider" as const,
                    },
                    {
                        key: 'create',
                        label: <Button type="text" style={{ width: "100%", textAlign: "left" }}>
                            + Create Business
                        </Button>
                    }
                ],
                onClick: handleMenuClick
            }}
            trigger={['click']}
        >
            <Button>
                Select Business <DownOutlined />
            </Button>
        </Dropdown>
    );
};

export default BusinessDropdown;