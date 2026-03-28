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
    message,
    Space,
    Grid,
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
import { useRouter } from "next/navigation";

const { useBreakpoint } = Grid;

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
    const router = useRouter()
    const [msgApi, contextHolder] = message.useMessage();

    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState("list");
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

    // console.log(mockModules);

    // console.log('module' ,moduleMatrix);

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
                    style={{ background: s === "Active" ? "#21c45d" : "red", color: 'white' }}
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
                                onClick: () => router.push(`/super-admin/dashboard/packages/edit/${record.id}`),
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
                    <Flex
                    justify="space-between"
                    wrap="wrap"
                    >
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

                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => router.push('/super-admin/dashboard/packages/create')}
                        >
                            Create Package
                        </Button>
                    </Flex>

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