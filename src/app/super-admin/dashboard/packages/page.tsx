"use client";

import { useState } from "react";
import {
    Card,
    Button,
    Input,
    Table,
    Tabs,
    Modal,
    Dropdown,
    Tag,
    Checkbox,
    Select,
    message,
    Space,
    Grid,
    Typography,
    Flex,
    InputNumber,
} from "antd";
import {
    PlusOutlined,
    SearchOutlined,
    MoreOutlined,
} from "@ant-design/icons";
import { mockModules, mockPackages } from "@/components/demoData/mockData";
import PageHeader from "@/components/shared/page-header";

const { TextArea } = Input;
const { useBreakpoint } = Grid;
const { Option } = Select;

/* ---------------- LIMIT DATA ---------------- */

const limits = [
    {
        key: "max_products",
        label: "Max Products",
        values: { Starter: 100, Growth: 1000, Enterprise: 10000 },
    },
    {
        key: "Max Warehouses",
        label: "Max Warehouses",
        values: { Starter: 1, Growth: 5, Enterprise: 25 },
    },
    {
        key: "max_users",
        label: "Max Users",
        values: { Starter: 5, Growth: 25, Enterprise: 100 },
    },
    {
        key: "Max Orders/mo",
        label: "Max Orders/mo",
        values: { Starter: 500, Growth: 5000, Enterprise: 50000 },
    },
    {
        key: "Max Websites",
        label: "Max Websites",
        values: { Starter: 1, Growth: 3, Enterprise: 10 },
    },
];

export default function PackageListPage() {
    const screen = useBreakpoint();
    const [msgApi, contextHolder] = message.useMessage();

    // status
    const [statusFilter, setStatusFilter] = useState<string>('');

    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState("list");
    const [showModal, setShowModal] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    /* ---------------- MODULE MATRIX STATE ---------------- */

    const [moduleMatrix, setModuleMatrix] = useState<
        Record<string, Record<string, boolean>>
    >(
        Object.fromEntries(
            mockModules.map((m) => [
                m.id,
                { Starter: true, Growth: true, Enterprise: true },
            ])
        )
    );

    /* ---------------- FILTER ---------------- */

    const filteredPackages = mockPackages.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    /* ---------------- PACKAGE LIST TABLE ---------------- */

    const packageColumns = [
        {
            title: "Package",
            dataIndex: "name",
            render: (t: string) => <strong>{t}</strong>,
        },
        {
            title: "Monthly",
            dataIndex: "monthlyPrice",
            render: (v: number) => `$${v}`,
        },
        {
            title: "Yearly",
            dataIndex: "yearlyPrice",
            render: (v: number) => `$${v}`,
        },
        {
            title: "Status",
            dataIndex: "status",
            render: (s: string) => (
                <Tag
                style={{background: s === "Active" ? "#21c45d" : "red", color: 'white'}}
                >{s}</Tag>
            ),
        },
        {
            title: "Subscribers",
            dataIndex: "subscribers",
        },
        {
            title: "",
            render: (_: any, record: any) => (
                <Dropdown
                    menu={{
                        items: [
                            {
                                key: "edit",
                                label: "Edit",
                                onClick: () => setShowModal(true),
                            },
                            {
                                key: "delete",
                                danger: true,
                                label: "Delete",
                                onClick: () => setDeleteConfirm(record.name),
                            },
                        ],
                    }}
                >
                    <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
            ),
        },
    ];

    /* ---------------- MODULE MATRIX TABLE ---------------- */

    const moduleMatrixColumns = [
        {
            title: "Module",
            dataIndex: "name",
            fixed: "left" as const,
            width: 200,
        },
        ...mockPackages.map((p) => ({
            title: p.name,
            key: p.name,
            align: "center" as const,
            render: (_: any, record: any) => (
                <Checkbox
                    checked={moduleMatrix[record.id]?.[p.name]}
                    onChange={(e) =>
                        setModuleMatrix((prev) => ({
                            ...prev,
                            [record.id]: {
                                ...prev[record.id],
                                [p.name]: e.target.checked,
                            },
                        }))
                    }
                />
            ),
        })),
    ];

    const moduleMatrixData = mockModules.map((m) => ({
        key: m.id,
        id: m.id,
        name: m.name,
    }));

    /* ---------------- LIMIT SETTINGS TABLE ---------------- */

    const limitColumns = [
        {
            title: "Limit",
            dataIndex: "label",
            fixed: "left" as const,
            width: 200,
        },
        ...mockPackages.map((p) => ({
            title: p.name,
            key: p.name,
            align: "center" as const,
            render: (_: any, record: any) => (
                <InputNumber
                    defaultValue={record.values[p.name]}
                    style={{ width: 100 }}
                />
            ),
        })),
    ];

    const limitData = limits.map((l) => ({
        key: l.key,
        label: l.label,
        values: l.values,
    }));

    /* ---------------- TABS ---------------- */

    const tabs = [
        {
            key: "list",
            label: "Package List",
            children: (
                <Card>
                    <Space style={{ marginBottom: 16 }}>
                        <Input
                            style={{
                                width: screen.lg ? "330px" : "100%"
                            }}
                            prefix={<SearchOutlined />}
                            placeholder="Search packages..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </Space>

                    <Table
                        rowKey="id"
                        columns={packageColumns}
                        dataSource={filteredPackages}
                        pagination={false}
                        scroll={{ x: "max-content" }}
                    />
                </Card>
            ),
        },
        {
            key: "matrix",
            label: "Module Matrix",
            children: (
                <Card>
                    <div style={{ overflowX: 'auto', overflowY: 'hidden' }}>
                        <Table
                            columns={moduleMatrixColumns}
                            dataSource={moduleMatrixData}
                            pagination={false}
                        />
                    </div>
                </Card>
            ),
        },
        {
            key: "limits",
            label: "Limit Settings",
            children: (
                <Card>
                    <div style={{ overflowX: 'auto', overflowY: 'hidden' }}>
                        <Table
                            columns={limitColumns}
                            dataSource={limitData}
                            pagination={false}
                        />
                    </div>

                    <div style={{ textAlign: "right", marginTop: 16 }}>
                        <Button type="primary">Save Limits</Button>
                    </div>
                </Card>
            ),
        },
    ];

    /* ---------------- RENDER ---------------- */

    return (
        <>
            {contextHolder}

            <div style={{ marginBottom: '8px' }}>
                <PageHeader title="Package">
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setShowModal(true)}
                    >
                        Create Package
                    </Button>
                </PageHeader>
            </div>

            <div>
                <Tabs items={tabs} activeKey={activeTab} onChange={setActiveTab} />
            </div>

            {/* CREATE MODAL */}
            <Modal
                title="Create Package"
                open={showModal}
                onCancel={() => setShowModal(false)}
                onOk={() => {
                    msgApi.success("Package saved");
                    setShowModal(false);
                }}
            >
                {/* Package Name */}
                <Typography.Title level={5} style={{ marginTop: 8 }}>
                    Package Name
                </Typography.Title>
                <Input placeholder="Business name" />

                {/* Slug */}
                <Typography.Title level={5} style={{ marginTop: 8 }}>
                    Slug
                </Typography.Title>
                <Input placeholder="Slug" />

                {/* Prices */}
                <Flex gap={16}>
                    <div style={{ flex: 1 }}>
                        <Typography.Title level={5} style={{ marginTop: 8 }}>
                            Monthly Price ($)
                        </Typography.Title>
                        <InputNumber style={{ width: "100%" }} defaultValue={149} />
                    </div>

                    <div style={{ flex: 1 }}>
                        <Typography.Title level={5} style={{ marginTop: 8 }}>
                            Yearly Price ($)
                        </Typography.Title>
                        <InputNumber style={{ width: "100%" }} defaultValue={1430} />
                    </div>
                </Flex>

                {/* Description */}
                <Typography.Title level={5} style={{ marginTop: 8 }}>
                    Description
                </Typography.Title>
                <TextArea
                    placeholder="Package Description..."
                    autoSize={{ minRows: 3, maxRows: 5 }}
                />

                {/* Type & Status */}
                <Flex gap={16}>
                    <div style={{ flex: 1 }}>
                        <Typography.Title level={5} style={{ marginTop: 8 }}>
                            Type
                        </Typography.Title>
                        <Select
                            style={{ width: "100%" }}
                            value={statusFilter}
                            onChange={setStatusFilter}
                        >
                            <Option value="usage">Usage</Option>
                            <Option value="per-unit">Per Unit</Option>
                            <Option value="flat">Flat</Option>
                        </Select>
                    </div>

                    <div style={{ flex: 1 }}>
                        <Typography.Title level={5} style={{ marginTop: 8 }}>
                            Status
                        </Typography.Title>
                        <Select
                            style={{ width: "100%" }}
                            value={statusFilter}
                            onChange={setStatusFilter}
                        >
                            <Option value="active">Active</Option>
                            <Option value="inactive">Inactive</Option>
                        </Select>
                    </div>
                </Flex>
            </Modal>

            {/* DELETE MODAL */}
            <Modal
                title="Delete Package"
                open={!!deleteConfirm}
                onCancel={() => setDeleteConfirm(null)}
                onOk={() => {
                    msgApi.warning(`${deleteConfirm} deleted`);
                    setDeleteConfirm(null);
                }}
                okButtonProps={{ danger: true }}
            >
                Are you sure you want to delete <strong>{deleteConfirm}</strong>?
            </Modal>
        </>
    );
}