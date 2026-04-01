import React from "react";
import { Table, Tag } from "antd";

const productVariants = [
    {
        id: 1,
        name: "USB-C Charger",
        slug: "usb-c-charger",
        sku: "UC-001",
        barcode: "9876543210001",
        cost_price: 9.0,
        sale_price: 17.0,
        margin: 8.0,
        stock: 20,
        stock_alert: "Normal",
        color: "White",
        power: "18W",
        plug_type: "US",
    },
    {
        id: 2,
        name: "Wireless Mouse",
        slug: "wireless-mouse",
        sku: "WM-014",
        barcode: "1234567890123",
        cost_price: 12.5,
        sale_price: 25.0,
        margin: 12.5,
        stock: 5,
        stock_alert: "Low Stock",
        color: "Black",
        connectivity: "Bluetooth",
        dpi: "1600",
    },
    {
        id: 3,
        name: "USB-C Cable",
        slug: "usb-c-cable",
        sku: "UC-009",
        barcode: "9988776655443",
        cost_price: 4.0,
        sale_price: 10.0,
        margin: 6.0,
        stock: 50,
        stock_alert: "Normal",
        color: "Black",
        length: "1m",
        material: "Nylon",
    },
    {
        id: 4,
        name: "Wireless Keyboard",
        slug: "wireless-keyboard",
        sku: "WK-021",
        barcode: "5647382910456",
        cost_price: 22.5,
        sale_price: 45.0,
        margin: 22.5,
        stock: 4,
        stock_alert: "Low Stock",
        color: "Black",
        connectivity: "Bluetooth",
        layout: "US",
    },
    {
        id: 5,
        name: "Power Bank",
        slug: "power-bank-10000",
        sku: "PB-010",
        barcode: "1112223334445",
        cost_price: 18.0,
        sale_price: 35.0,
        margin: 17.0,
        stock: 0,
        stock_alert: "Out of Stock",
        color: "Gray",
        capacity: "10000mAh",
        fast_charge: true,
    },
];

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
    { title: "Power / Capacity", key: "power_capacity", render: (_: string, record: any) => record.power || record.capacity || "-" },
    { title: "Extra", key: "extra", render: (_:string, record: any) => record.plug_type || record.connectivity || record.length || record.material || record.layout || (record.fast_charge ? "Fast Charge" : "-") },
];

export default function VariantTable() {
    return (
        <div style={{marginTop: '8px', overflow: 'auto'}}>
            <Table
                rowKey="id"
                dataSource={productVariants}
                columns={columns}
                pagination={{ pageSize: 5 }}
                bordered
            />
        </div>
    );
}