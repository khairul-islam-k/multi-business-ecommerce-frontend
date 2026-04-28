"use client";

import {
  Card,
  Descriptions,
  Avatar,
  Tag,
  Row,
  Col,
  Typography,
  Spin,
  Empty,
  Space,
  Divider,
  Tabs,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const { Title, Text } = Typography;

const UserDetail = () => {
  const { id } = useParams();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const res = await api.get(`/users/${id}`);
      return res.data?.data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return <Empty description="User not found" />;
  }

  /* =========================
     OVERVIEW TAB
  ========================= */
  const OverviewTab = (
    <Row gutter={16}>
      {/* PROFILE SUMMARY */}
      <Col xs={24} md={8}>
        <Card>
          <div style={{ textAlign: "center" }}>
            <Avatar size={96} src={user.image_url} icon={<UserOutlined />} />

            <Title level={5} style={{ marginTop: 12 }}>
              {user.name}
            </Title>

            <Space>
              <Tag color={user.status === "Active" ? "green" : "red"}>
                {user.status}
              </Tag>
              <Tag color="purple">{user.user_type}</Tag>
            </Space>

            {user.is_email_verified && (
              <div style={{ marginTop: 8 }}>
                <Tag color="blue">Email Verified</Tag>
              </div>
            )}
          </div>

          <Divider />

          <Text strong>Roles</Text>
          <div style={{ marginTop: 8 }}>
            {user.roles?.length ? (
              <Space wrap>
                {user.roles.map((role: any) => (
                  <Tag key={role.id}>{role.name}</Tag>
                ))}
              </Space>
            ) : (
              <Text type="secondary">No roles assigned</Text>
            )}
          </div>
        </Card>
      </Col>

      {/* ACCOUNT INFO */}
      <Col xs={24} md={16}>
        <Card title="Account Information">
          <Descriptions bordered column={1}>
            <Descriptions.Item label="ID">{user.id}</Descriptions.Item>
            <Descriptions.Item label="UUID">{user.uuid}</Descriptions.Item>
            <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
            <Descriptions.Item label="Phone">
              {user.phone || "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Last Login">
              {user.last_login_at || "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {user.createdAt}
            </Descriptions.Item>
            <Descriptions.Item label="Updated At">
              {user.updatedAt}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Col>
    </Row>
  );

  /* =========================
     PROFILE TAB
  ========================= */
  const ProfileTab = (
    <Card title="Profile Information">
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Gender">
          {user.profile?.gender || "—"}
        </Descriptions.Item>
        <Descriptions.Item label="Date of Birth">
          {user.profile?.date_of_birth || "—"}
        </Descriptions.Item>
        <Descriptions.Item label="Address">
          {user.profile?.address || "—"}
        </Descriptions.Item>
        <Descriptions.Item label="City">
          {user.profile?.city || "—"}
        </Descriptions.Item>
        <Descriptions.Item label="State">
          {user.profile?.state || "—"}
        </Descriptions.Item>
        <Descriptions.Item label="Postal Code">
          {user.profile?.postal_code || "—"}
        </Descriptions.Item>
        <Descriptions.Item label="Country">
          {user.profile?.country || "—"}
        </Descriptions.Item>
        <Descriptions.Item label="Emergency Contact">
          {user.profile?.emergency_contact || "—"}
        </Descriptions.Item>
        <Descriptions.Item label="Notes">
          {user.profile?.notes || "—"}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );

  /* =========================
     ACTIVITY TAB
  ========================= */
  const ActivityTab = (
    <Card title="Activity">
      <Empty description="No activity data yet" />
    </Card>
  );

  /* =========================
     PERMISSIONS TAB
  ========================= */
  const PermissionsTab = (
    <Card title="Permissions & Roles">
      <Text strong>Assigned Roles</Text>
      <div style={{ marginTop: 12 }}>
        {user.roles?.length ? (
          <Space wrap>
            {user.roles.map((role: any) => (
              <Tag key={role.id}>{role.name}</Tag>
            ))}
          </Space>
        ) : (
          <Text type="secondary">No roles assigned</Text>
        )}
      </div>

      <Divider />

      <Text strong>Permissions</Text>
      <div style={{ marginTop: 8 }}>
        <Text type="secondary">Permissions system not implemented yet</Text>
      </div>
    </Card>
  );

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <PageHeader title="User Details" breadcrumb={adminBreadcrumb} />
      </div>

      <Tabs
        defaultActiveKey="overview"
        items={[
          { key: "overview", label: "Overview", children: OverviewTab },
          { key: "profile", label: "Profile", children: ProfileTab },
          { key: "activity", label: "Activity", children: ActivityTab },
          {
            key: "permissions",
            label: "Permissions",
            children: PermissionsTab,
          },
        ]}
      />
    </>
  );
};

export default UserDetail;
