"use client";

import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Empty,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import { ReloadOutlined, UserOutlined } from "@ant-design/icons";

import { useAuthStore } from "@/stores/auth.store";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const { Text } = Typography;

export default function UserProfilePage() {
  const user = useAuthStore((state) => state.user);
  const selectedBusiness = useAuthStore((state) => state.selectedBusiness);
  const businesses = useAuthStore((state) => state.businesses);
  const fetchProfile = useAuthStore((state) => state.fetchProfile);
  const loading = useAuthStore((state) => state.loading);

  if (!user) return <Empty description="No user profile loaded" />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Profile"
        subtitle="This is the authenticated profile returned by /auth/me."
        breadcrumb={adminBreadcrumb}
        actions={
          <Button
            icon={<ReloadOutlined />}
            loading={loading}
            onClick={() => fetchProfile()}
          >
            Refresh
          </Button>
        }
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card>
            <Space direction="vertical" size={14} className="w-full text-center">
              <Avatar size={88} icon={<UserOutlined />}>
                {user.name?.charAt(0).toUpperCase()}
              </Avatar>

              <div>
                <Text strong className="block text-lg">
                  {user.name}
                </Text>
                <Text type="secondary">{user.email}</Text>
              </div>

              <Space wrap className="justify-center">
                <Tag color={user.type === "EMPLOYEE" ? "blue" : "green"}>
                  {user.type}
                </Tag>
                <Tag color={user.status === "ACTIVE" ? "success" : "default"}>
                  {user.status ?? "ACTIVE"}
                </Tag>
              </Space>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Card title="Account">
            <Descriptions bordered column={{ xs: 1, md: 2 }}>
              <Descriptions.Item label="User ID">{user.id}</Descriptions.Item>
              <Descriptions.Item label="UUID">{user.uuid ?? "-"}</Descriptions.Item>
              <Descriptions.Item label="Name">{user.name}</Descriptions.Item>
              <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
              <Descriptions.Item label="Phone">{user.phone ?? "-"}</Descriptions.Item>
              <Descriptions.Item label="Type">{user.type}</Descriptions.Item>
              <Descriptions.Item label="Status">
                {user.status ?? "ACTIVE"}
              </Descriptions.Item>
              <Descriptions.Item label="Created">
                {user.createdAt ?? "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Updated">
                {user.updatedAt ?? "-"}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="Active Business" className="mt-4">
            {selectedBusiness ? (
              <Descriptions bordered column={{ xs: 1, md: 2 }}>
                <Descriptions.Item label="Business ID">
                  {selectedBusiness.id}
                </Descriptions.Item>
                <Descriptions.Item label="Name">
                  {selectedBusiness.name}
                </Descriptions.Item>
                <Descriptions.Item label="Owner user ID">
                  {selectedBusiness.ownerUserId}
                </Descriptions.Item>
                <Descriptions.Item label="Accessible businesses">
                  {businesses.length}
                </Descriptions.Item>
              </Descriptions>
            ) : (
              <Empty description="No active business selected" />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
