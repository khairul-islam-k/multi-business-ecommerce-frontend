"use client";

import React, { useMemo } from "react";
import { Button, Space, Tag } from "antd";
import { useRouter } from "next/navigation";

import { TVariant } from "../page";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { DataTable } from "@/components/shared/data-table";

interface VariantTableProps {
  tableData?: TVariant[]; // 🔹 optional (important)
  handleDelete: (id: string) => void;
}

const VariantTable: React.FC<VariantTableProps> = ({
  tableData,
  handleDelete,
}) => {
  const router = useRouter();

  // ✅ ALWAYS ensure array
  const safeData = useMemo<TVariant[]>(() => {
    return Array.isArray(tableData) ? tableData : [];
  }, [tableData]);

  const columns = [
    {
      label: "Name",
      key: "name",
    },
    {
      label: "SKU",
      key: "sku",
    },
    {
      label: "Barcode",
      key: "barcode",
    },
    {
      label: "Cost Price ($)",
      key: "cost_price",
    },
    {
      label: "Sale Price ($)",
      key: "sale_price",
    },
    {
      label: "Status",
      key: "status",
      render: (record: TVariant) => {
        const color =
          record.status === "Active"
            ? "green"
            : record.status === "Inactive"
              ? "orange"
              : "red";
        return <Tag color={color}>{record.status}</Tag>;
      },
    },
    {
      label: "Actions", // ✅ FIXED
      key: "actions",
      render: (record: TVariant) => (
        <Space>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() =>
              router.push(
                `/admin/dashboard/products-management/variant/details/${record.uuid}`,
              )
            }
          />

          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() =>
              router.push(
                `/admin/dashboard/products-management/variant/update/${record.uuid}`,
              )
            }
          />

          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.uuid)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ marginTop: 8, overflowX: "auto" }}>
      <DataTable data={safeData} columns={columns} />
    </div>
  );
};

export default VariantTable;
