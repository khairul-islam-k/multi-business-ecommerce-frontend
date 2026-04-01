import { Table, Tag } from "antd";

const dataSource = [
    {
        key: 1,
        id: 1,
        name: "USB-C Charger",
        sku: "UC-001",
        cost_price: 9.0,
        sale_price: 17.0,
        margin: 8.0,
        stock: 20,
        stock_alert: "Normal",
    },
    {
        key: 2,
        id: 2,
        name: "Wireless Mouse",
        sku: "WM-014",
        cost_price: 12.5,
        sale_price: 25.0,
        margin: 12.5,
        stock: 5,
        stock_alert: "Low Stock",
    },
    {
        key: 3,
        id: 3,
        name: "USB-C Cable",
        sku: "UC-009",
        cost_price: 4.0,
        sale_price: 10.0,
        margin: 6.0,
        stock: 50,
        stock_alert: "Normal",
    },
    {
        key: 4,
        id: 4,
        name: "Wireless Keyboard",
        sku: "WK-021",
        cost_price: 22.5,
        sale_price: 45.0,
        margin: 22.5,
        stock: 4,
        stock_alert: "Low Stock",
    },
    {
        key: 5,
        id: 5,
        name: "Power Bank",
        sku: "PB-010",
        cost_price: 18.0,
        sale_price: 35.0,
        margin: 17.0,
        stock: 0,
        stock_alert: "Out of Stock",
    },
];

const columns = [
    {
        title: "ID",
        dataIndex: "id",
    },
    {
        title: "Product Name",
        dataIndex: "name",
    },
    {
        title: "SKU",
        dataIndex: "sku",
    },
    {
        title: "Cost Price ($)",
        dataIndex: "cost_price",
    },
    {
        title: "Sale Price ($)",
        dataIndex: "sale_price",
    },
    {
        title: "Margin ($)",
        dataIndex: "margin",
    },
    {
        title: "Stock",
        dataIndex: "stock",
    },
    {
        title: "Status",
        dataIndex: "stock_alert",
        render: (status: string) => {
            let color =
                status === "Normal"
                    ? "green"
                    : status === "Low Stock"
                        ? "orange"
                        : "red";

            return <Tag color={color}>{status}</Tag>;
        },
    },
];

export default function VariantTable() {
    return (
        <div style={{marginTop: '8px'}}>
            <Table
                dataSource={dataSource}
                columns={columns}
                pagination={{ pageSize: 5 }}
            />
        </div>
    );
}