"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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


const limits = [
    {
        key: "max_products",
        label: "Max Products",
        values: { Starter: 100, Growth: 1000, Enterprise: 10000 },
    },
    {
        key: "max_users",
        label: "Max Users",
        values: { Starter: 5, Growth: 25, Enterprise: 100 },
    },
];

export default function PackageListPage() {
    const router = useRouter();
    const { Option } = Select;
    const [msgApi, contextHolder] = message.useMessage();
    const { useBreakpoint } = Grid;
    const screen = useBreakpoint();

    const [search, setSearch] = useState("");
    // select
    const [statusFilter, setStatusFilter] = useState("");
    const [activeTab, setActiveTab] = useState("list");
    const [showModal, setShowModal] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

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

    const filtered = mockPackages.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    /* ---------------- TABLE COLUMNS ---------------- */

    const columns = [
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
                    style={{ background: s === "Active" ? "#21c45d" : "#ef4444", color: 'white' }}
                    color={s === "active" ? "green" : "red"}>{s}</Tag>
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

    /* ---------------- TABS CONTENT ---------------- */

    const items = [
        {
            key: "list",
            label: "Package List",
            children: (
                <Card style={{ overflowX: 'auto' }}>
                    <Space style={{ marginBottom: 16 }}>
                        <Input
                            style={{ width: screen.lg ? 300 : "100%", height: screen.lg ? 50 : 40 }}
                            prefix={<SearchOutlined />}
                            placeholder="Search packages..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </Space>

                    <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={filtered}
                        pagination={false}
                    />
                </Card>
            ),
        },

        {
            key: "matrix",
            label: "Module Matrix",
            children: (
                <Card>
                    <div style={{ overflowX: "auto" }}>
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th>Module</th>
                                    {mockPackages.map((p) => (
                                        <th key={p.id}>{p.name}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {mockModules.map((m) => (
                                    <tr key={m.id}>
                                        <td>{m.name}</td>
                                        {mockPackages.map((p) => (
                                            <td key={p.id} style={{ textAlign: "center" }}>
                                                <Checkbox
                                                    checked={moduleMatrix[m.id][p.name]}
                                                    onChange={(e) =>
                                                        setModuleMatrix((prev) => ({
                                                            ...prev,
                                                            [m.id]: {
                                                                ...prev[m.id],
                                                                [p.name]: e.target.checked,
                                                            },
                                                        }))
                                                    }
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            ),
        },

        {
            key: "limits",
            label: "Limit Settings",
            children: (
                <Card>
                    <div style={{ overflowX: "auto" }}>
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th>Limit</th>
                                    {mockPackages.map((p) => (
                                        <th key={p.id}>{p.name}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {limits.map((l) => (
                                    <tr key={l.key}>
                                        <td>{l.label}</td>
                                        {mockPackages.map((p) => (
                                            <td key={p.id}>
                                                <Input
                                                    type="number"
                                                    defaultValue={l.values[p.name]}
                                                    style={{ width: 80 }}
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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

            <div style={{ marginBottom: '10px' }}>
                <PageHeader title='Package'>
                    <Button
                        onClick={() => setShowModal(true)}
                        icon={<PlusOutlined />}
                        type='primary'> create package </Button>
                </PageHeader>
            </div>

            <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />

            {/* CREATE / EDIT MODAL */}
            <Modal
                title="Create Package"
                open={showModal}
                onCancel={() => setShowModal(false)}
                onOk={() => {
                    msgApi.success("Package saved");
                    setShowModal(false);
                }}
            >
                <Typography.Title style={{ marginTop: "8px" }} level={5}>Business Name</Typography.Title>
                <Input placeholder="Business name" className="mb-2" />

                <Typography.Title style={{ marginTop: "8px" }} level={5}>Slug</Typography.Title>
                <Input placeholder="Slug" className="mb-2" />

                <Typography.Title style={{ marginTop: "8px" }} level={5}>Email</Typography.Title>
                <Input placeholder="Email" className="mb-2" />

                <Typography.Title style={{ marginTop: "8px" }} level={5}>Phone</Typography.Title>
                <Input placeholder="+880156415" />


                <Flex gap={16}>
                    <div style={{ flex: 1 }}>
                        <Typography.Title level={5} style={{ marginTop: 8 }}>
                            Status
                        </Typography.Title>
                        <Select
                            style={{ width: '100%' }}
                            value={statusFilter}
                            onChange={setStatusFilter}
                        >
                            <Option value="all">All Status</Option>
                            <Option value="Active">Active</Option>
                            <Option value="Trial">Trial</Option>
                            <Option value="Suspended">Suspended</Option>
                        </Select>
                    </div>

                    <div style={{ flex: 1 }}>
                        <Typography.Title level={5} style={{ marginTop: 8 }}>
                            Trial duration (days)
                        </Typography.Title>
                        <InputNumber style={{ width: '100%' }} defaultValue={999} />
                    </div>
                </Flex>

                <Flex gap={16}>
                    <div style={{ flex: 1 }}>
                        <Typography.Title level={5} style={{ marginTop: 8 }}>
                            Currency
                        </Typography.Title>
                        <Select
                            style={{ width: '100%' }}
                            value={statusFilter}
                            onChange={setStatusFilter}
                        >
                            <Option value="bdt">BDT</Option>
                            <Option value="usd">USD</Option>
                            <Option value="eur">EUR</Option>
                        </Select>
                    </div>

                    <div style={{ flex: 1 }}>
                        <Typography.Title level={5} style={{ marginTop: 8 }}>
                            TimeZone
                        </Typography.Title>
                        <Select
                            style={{ width: '100%' }}
                            value={statusFilter}
                            onChange={setStatusFilter}
                        >
                            <Option value="utc">UTC</Option>
                            <Option value="est">EST</Option>
                            <Option value="pst">PST</Option>
                        </Select>
                    </div>
                </Flex>
            </Modal>

            {/* DELETE CONFIRM */}
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