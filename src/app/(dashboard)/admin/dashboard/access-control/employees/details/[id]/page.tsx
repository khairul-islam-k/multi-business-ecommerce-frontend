"use client";

import { useParams } from "next/navigation";
import {
  Avatar,
  Card,
  Col,
  Descriptions,
  Divider,
  Empty,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import { UserOutlined } from "@ant-design/icons";

import { useEmployee } from "@/lib/api";
import { useActiveBusinessId } from "@/hooks/use-active-business";
import PageHeader from "@/components/shared/page-header";
import Loader from "@/components/shared/loader";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const { Title, Text } = Typography;

const UserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const businessId = useActiveBusinessId();
  const employeeId = Number(id);

  const { data: user, isLoading } = useEmployee(
    businessId ?? undefined,
    employeeId,
  );

  if (!businessId) return <Empty description="No active business selected" />;

  if (isLoading) {
    return (
      <Loader
        label="Loading employee"
        description="Fetching the selected employee profile."
      />
    );
  }

  if (!user) return <Empty description="Employee not found" />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employee Details"
        subtitle="Review account details, profile data, and assigned roles for this employee."
        breadcrumb={adminBreadcrumb}
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card>
            <div className="text-center">
              <Avatar
                size={96}
                src={user.profile?.imageUrl}
                icon={<UserOutlined />}
              />

              <Title level={5} style={{ marginTop: 12 }}>
                {user.name}
              </Title>

              <Tag color={user.status === "ACTIVE" ? "green" : "red"}>
                {user.status ?? "ACTIVE"}
              </Tag>
            </div>

            <Divider />

            <Text strong>Roles</Text>
            <div className="mt-2">
              {user.roles?.length ? (
                <Space wrap>
                  {user.roles.map((role) => (
                    <Tag key={role.id}>{role.name}</Tag>
                  ))}
                </Space>
              ) : (
                <Text type="secondary">No roles assigned</Text>
              )}
            </div>
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Card title="Account Information">
            <Descriptions bordered column={1}>
              <Descriptions.Item label="ID">{user.id}</Descriptions.Item>
              <Descriptions.Item label="UUID">
                {user.uuid || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
              <Descriptions.Item label="Phone">
                {user.phone || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Created At">
                {user.createdAt || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Updated At">
                {user.updatedAt || "-"}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      <Card title="Profile Information">
        <Descriptions bordered column={{ xs: 1, md: 2 }}>
          <Descriptions.Item label="First Name">
            {user.profile?.firstName || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Last Name">
            {user.profile?.lastName || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Gender">
            {user.profile?.gender || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Date of Birth">
            {user.profile?.dateOfBirth || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Address">
            {user.profile?.address || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="City">
            {user.profile?.city || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Country">
            {user.profile?.country || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Bio">
            {user.profile?.bio || "-"}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default UserDetail;
