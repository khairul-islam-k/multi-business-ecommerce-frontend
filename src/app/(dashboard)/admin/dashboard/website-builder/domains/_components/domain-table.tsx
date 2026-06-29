import {
  Globe,
  RefreshCw,
  Trash2
} from "lucide-react";
import React from "react";
import { Table, Space, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";

interface Domain {
  id: number;
  Domain: string;
  Website: string;
  "DNS Status": string;
  "SSL Status": string;
  Primary: string;
}

const data: Domain[] = [
  {
    id: 1,
    Domain: "mainstore.com",
    Website: "Main Store",
    "DNS Status": "verified",
    "SSL Status": "Active",
    Primary: "Primary",
  },
  {
    id: 2,
    Domain: "shop.mainstore.com",
    Website: "Main Store Shop",
    "DNS Status": "verified",
    "SSL Status": "Active",
    Primary: "Secondary",
  },
  {
    id: 3,
    Domain: "admin.mainstore.com",
    Website: "Main Store Admin",
    "DNS Status": "pending",
    "SSL Status": "Inactive",
    Primary: "Secondary",
  },
  {
    id: 4,
    Domain: "blog.mainstore.com",
    Website: "Main Store Blog",
    "DNS Status": "verified",
    "SSL Status": "Active",
    Primary: "Secondary",
  },
];

const DomainTable: React.FC = () => {
  const handleRefresh = (record: Domain) => {
    console.log("Refresh domain:", record.Domain);
  };

  const handleDelete = (record: Domain) => {
    console.log("Delete domain:", record.Domain);
  };

  const columns: ColumnsType<Domain> = [
    {
      title: "Domain",
      dataIndex: "Domain",
      key: "Domain",
      render: (Domain: string) => {
        return (
          <div
            style={{
              display: "flex",
              gap: "5px",
            }}
          >
            <div>
              <Globe />
            </div>
            <div>{Domain}</div>
          </div>
        );
      },
    },
    {
      title: "Website",
      dataIndex: "Website",
      key: "Website",
    },
    {
      title: "DNS Status",
      dataIndex: "DNS Status",
      key: "DNS Status",
    },
    {
      title: "SSL Status",
      dataIndex: "SSL Status",
      key: "SSL Status",
    },
    {
      title: "Primary",
      dataIndex: "Primary",
      key: "Primary",
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Refresh DNS / SSL status">
            <RefreshCw
              style={{ cursor: "pointer" }}
              onClick={() => handleRefresh(record)}
            />
          </Tooltip>

          <Tooltip title="Delete Domain">
            <Trash2
              style={{ color: "var(--dashboard-error-color)", cursor: "pointer" }}
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table columns={columns} dataSource={data} rowKey="id" pagination={false} />
  );
};

export default DomainTable;
