import React from "react";
import { Button, Space, Table, Tag } from "antd";
import { TVariant } from "../page";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

interface VariantTableProps {
    tableData: TVariant[];
    handleDelete: (id: string) => void;
}



export default function VariantTable({ tableData, handleDelete }: VariantTableProps) {
    const router = useRouter();



    const columns = [
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "SKU", dataIndex: "sku", key: "sku" },
        { title: "Barcode", dataIndex: "barcode", key: "barcode" },
        { title: "Cost Price ($)", dataIndex: "cost_price", key: "cost_price" },
        { title: "Sale Price ($)", dataIndex: "sale_price", key: "sale_price" },
        { title: "Margin ($)", dataIndex: "margin", key: "margin" },
        { title: "Stock", dataIndex: "stock", key: "stock" },
        {
            title: "Stock Status",
            dataIndex: "stock_alert",
            key: "stock_alert",
            render: (status: string) => {
                const color =
                    status === "Normal" ? "green" : status === "Low Stock" ? "orange" : "red";
                return <Tag color={color}>{status}</Tag>;
            },
        },
        // Optional: include main attributes
        { title: "Color", dataIndex: "color", key: "color" },
        {
            label: "Actions",
            key: "actions",
            render: (record: TVariant) => (
                <Space>
                    <Button
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => {
                            router.push(
                                `/admin/dashboard/products-management/variant/details/${record.uuid}`
                            )
                        }}
                    />

                    <Button
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() =>
                            router.push(
                                `/admin/dashboard/products-management/variant/update/${record.uuid}`
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
        <div style={{ marginTop: '8px', overflow: 'auto' }}>
            <Table
                rowKey="id"
                dataSource={tableData}
                columns={columns}
                pagination={{ pageSize: 5 }}
                bordered
            />
        </div>
    );
}