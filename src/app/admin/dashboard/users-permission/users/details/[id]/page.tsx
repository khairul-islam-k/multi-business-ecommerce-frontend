"use client";

import {
    Card,
    Descriptions,
    Avatar,
    Tag,
    Row,
    Col,
    Typography,
} from "antd";
import { UserOutlined } from "@ant-design/icons";

import { useParams } from "next/navigation";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
const { Title } = Typography;

const UserDetail = () => {
    const { id } = useParams();
    // 👉 Normally this data comes from API
    const user = {
        id: 1,
        uuid: "a3f1c2d4-9b7e-4a21-8e6c-1f2b3c4d5e6f",
        tenant_id: null,
        company_id: 2,
        name: "Rahim Uddin",
        email: "rahim.uddin@example.com",
        phone: "+8801712345678",
        avatar: "https://example.com/avatars/rahim-uddin.png",
        status: "active",
        is_email_verified: true,
        last_login_at: "2026-03-28 14:32",
        created_by: "Admin",
        updated_by: "Admin",
        created_at: "2026-03-01 09:15",
        updated_at: "2026-03-28 14:32",
        deleted_at: null,
    };

    return (
        <>
        <div style={{marginBottom: '24px'}}>
            <PageHeader title="User Details" breadcrumb={adminBreadcrumb}></PageHeader>
        </div>


            <Row gutter={16}>
                {/* Profile Card */}
                <Col xs={24} md={8}>
                    <Card>
                        <div style={{ textAlign: "center" }}>
                            <Avatar
                                size={96}
                                src={user.avatar}
                                icon={<UserOutlined />}
                            />

                            <Title level={5} style={{ marginTop: 12 }}>
                                {user.name}
                            </Title>

                            <Tag color="green">ACTIVE</Tag>

                            <div style={{ marginTop: 8 }}>
                                <Tag color="blue">Email Verified</Tag>
                            </div>
                        </div>
                    </Card>
                </Col>

                {/* Details Card */}
                <Col xs={24} md={16}>
                    <Card title="User Information">
                        <div style={{overflow: 'auto'}}>
                            <Descriptions
                                bordered
                                column={1}
                                contentStyle={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                }}
                            >
                                <Descriptions.Item label="ID">
                                    {user.id}
                                </Descriptions.Item>

                                <Descriptions.Item label="UUID" >
                                    {user.uuid}
                                </Descriptions.Item>

                                <Descriptions.Item label="Email" >
                                    {user.email}
                                </Descriptions.Item>

                                <Descriptions.Item label="Phone">
                                    {user.phone}
                                </Descriptions.Item>

                                <Descriptions.Item label="Company ID">
                                    {user.company_id ?? "—"}
                                </Descriptions.Item>

                                <Descriptions.Item label="Tenant ID">
                                    {user.tenant_id ?? "—"}
                                </Descriptions.Item>

                                <Descriptions.Item label="Last Login">
                                    {user.last_login_at}
                                </Descriptions.Item>

                                <Descriptions.Item label="Created By" >
                                    {user.created_by}
                                </Descriptions.Item>

                                <Descriptions.Item label="Created At">
                                    {user.created_at}
                                </Descriptions.Item>

                                <Descriptions.Item label="Updated At">
                                    {user.updated_at}
                                </Descriptions.Item>

                                <Descriptions.Item label="Deleted At" >
                                    {user.deleted_at ?? "—"}
                                </Descriptions.Item>
                            </Descriptions>
                        </div>
                    </Card>
                </Col>
            </Row>
        </>

    );
};

export default UserDetail;