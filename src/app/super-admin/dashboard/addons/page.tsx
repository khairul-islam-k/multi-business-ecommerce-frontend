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
    Select,
    message,
    Space,
    Typography,
    Form,
    Row,
    Col,
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

const { Title, Text } = Typography;

export default function AddonListPage() {
    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();

    const [msgApi, contextHolder] = message.useMessage();

    const [search, setSearch] = useState("");
    const [showCreate, setShowCreate] = useState(false);
    const [creating, setCreating] = useState(false);
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
                                onClick: () => setShowCreate(true),
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

    /* ---------------- SAVE HANDLER ---------------- */

    const handleSave = async () => {
        setCreating(true);
        await new Promise((r) => setTimeout(r, 1000));
        setCreating(false);
        setShowCreate(false);
        msgApi.success("Addon created successfully");
    };

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

                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowCreate(true)}>
                        Create Addon
                    </Button>
                </Flex>


                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={filtered}
                    pagination={false}
                    scroll={{ x: true }}
                />
            </Card>

            {/* CREATE / EDIT MODAL */}
            <Modal
                title="Create Addon"
                open={showCreate}
                onCancel={() => setShowCreate(false)}
                onOk={handleSave}
                confirmLoading={creating}
            >
                <Form layout="vertical">
                    <Form.Item label="Addon Name">
                        <Input placeholder="Extra Storage" />
                    </Form.Item>

                    <Form.Item label="Slug">
                        <Input placeholder="extra-storage" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item label="Type">
                                <Select defaultValue="usage" style={{ width: "100%" }}>
                                    <Select.Option value="usage">Usage</Select.Option>
                                    <Select.Option value="per-unit">Per Unit</Select.Option>
                                    <Select.Option value="flat">Flat</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item label="Unit Price ($)">
                                <Input type="number" placeholder="2.50" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item label="Limit Key">
                        <Input placeholder="storage_gb" />
                    </Form.Item>

                    <Form.Item label="Status">
                        <Select defaultValue="active">
                            <Select.Option value="active">Active</Select.Option>
                            <Select.Option value="inactive">Inactive</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

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