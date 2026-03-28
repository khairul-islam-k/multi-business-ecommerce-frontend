"use client";

import { useState } from "react";
import {
    Card,
    Button,
    Input,
    Table,
    Modal,
    Dropdown,
    Tag,
    message,
    Space,
    Typography,
    Grid,
    Flex,
} from "antd";
import {
    PlusOutlined,
    SearchOutlined,
    MoreOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import PageHeader from "@/components/shared/page-header";
import { mockAddons } from "@/components/demoData/mockData";
import Link from "next/link";
import { useRouter } from "next/navigation";

const { Text } = Typography;

export default function AddonListPage() {
    const router = useRouter();

    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();

    const [msgApi, contextHolder] = message.useMessage();

    const [search, setSearch] = useState("");
    
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const filtered = mockAddons.filter((a) =>
        a.name.toLowerCase().includes(search.toLowerCase())
    );

    /* ---------------- TABLE COLUMNS ---------------- */

    const columns: ColumnsType<any> = [
        {
            title: "Addon Name",
            dataIndex: "name",
            render: (v) => <strong>{v}</strong>,
        },
        {
            title: "Type",
            dataIndex: "type",
            render: (v) => <Tag>{v}</Tag>,
        },
        {
            title: "Limit Key",
            dataIndex: "limitKey",
            render: (v) => (
                <Text style={{ fontFamily: "monospace", fontSize: 12 }}>{v}</Text>
            ),
        },
        {
            title: "Unit Price",
            dataIndex: "unitPrice",
            render: (v) => `$${v}`,
        },
        {
            title: "Status",
            dataIndex: "status",
            render: (s) => (
                <Tag
                    style={{ background: s === "Active" ? "#21c45d" : "#ef4444", color: 'white' }}
                    color={s === "Active" ? "green" : "red"}>{s}</Tag>
            ),
        },
        {
            title: "",
            width: 60,
            render: (_, record) => (
                <Dropdown
                    menu={{
                        items: [
                            {
                                key: "edit",
                                label: "Edit",
                                onClick: () => router.push(`/super-admin/dashboard/addons/edit/${record.id}`),
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

    /* ---------------- RENDER ---------------- */

    return (
        <>
            {contextHolder}

            <div style={{ marginBottom: '24px' }}>
                <PageHeader title="Addons">
                </PageHeader>
            </div>

            <Card>
                <Flex
                    justify="space-between"
                    wrap="wrap"
                >
                    <Space style={{ marginBottom: 16 }}>
                        <Input
                            prefix={<SearchOutlined />}
                            placeholder="Search addons..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ width: screens.lg ? 300 : '100%' }}
                        />
                    </Space>

                    <Link href='/super-admin/dashboard/addons/create'>
                        <Button type="primary" icon={<PlusOutlined />} >
                            Create Addon
                        </Button>
                    </Link>
                </Flex>


                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={filtered}
                    pagination={false}
                    scroll={{ x: true }}
                />
            </Card>

            {/* DELETE CONFIRM */}
            <Modal
                title="Delete Addon"
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