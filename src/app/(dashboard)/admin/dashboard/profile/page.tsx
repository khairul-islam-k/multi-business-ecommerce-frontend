"use client";

import type { ReactNode } from "react";
import {
  Avatar,
  Card,
  Col,
  Empty,
  Flex,
  Row,
  Space,
  Tag,
  Typography,
  theme,
} from "antd";
import {
  BankOutlined,
  IdcardOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { useAuthStore } from "@/stores/auth.store";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const { Text, Title } = Typography;

function FieldRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value?: React.ReactNode;
}) {
  const { token } = theme.useToken();

  return (
    <Flex
      align="center"
      gap={12}
      style={{
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadius,
        padding: "12px 14px",
        minWidth: 0,
      }}
    >
      <div
        style={{
          alignItems: "center",
          background: token.colorPrimaryBg,
          borderRadius: token.borderRadius,
          color: token.colorPrimary,
          display: "flex",
          flexShrink: 0,
          height: 34,
          justifyContent: "center",
          width: 34,
        }}
      >
        {icon}
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <Text type="secondary" className="block text-xs">
          {label}
        </Text>
        <Text strong ellipsis style={{ display: "block", maxWidth: "100%" }}>
          {value || "-"}
        </Text>
      </div>
    </Flex>
  );
}

export default function UserProfilePage() {
  const user = useAuthStore((state) => state.user);
  const selectedBusiness = useAuthStore((state) => state.selectedBusiness);
  const businesses = useAuthStore((state) => state.businesses);
  const { token } = theme.useToken();

  if (!user) return <Empty description="No user profile loaded" />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Profile"
        subtitle="Your account and active business details."
        breadcrumb={adminBreadcrumb}
      />

      <Card styles={{ body: { padding: 0 } }} style={{ overflow: "hidden" }}>
        <div
          style={{
            background: `linear-gradient(135deg, ${token.colorPrimaryBg}, ${token.colorBgContainer})`,
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            padding: 24,
          }}
        >
          <Flex align="center" gap={18} wrap>
            <Avatar
              size={76}
              icon={<UserOutlined />}
              style={{
                background: token.colorPrimary,
                color: token.colorWhite,
                flexShrink: 0,
                fontWeight: 700,
              }}
            >
              {user.name?.charAt(0).toUpperCase()}
            </Avatar>

            <div style={{ minWidth: 0, flex: 1 }}>
              <Title level={3} ellipsis style={{ margin: 0 }}>
                {user.name}
              </Title>
              <Text type="secondary" ellipsis style={{ display: "block" }}>
                {user.email}
              </Text>
              <Space wrap className="mt-3">
                <Tag color={user.type === "EMPLOYEE" ? "blue" : "green"}>
                  {user.type}
                </Tag>
                <Tag color={user.status === "ACTIVE" ? "success" : "default"}>
                  {user.status ?? "ACTIVE"}
                </Tag>
              </Space>
            </div>

            <div
              style={{
                background: token.colorBgContainer,
                border: `1px solid ${token.colorBorderSecondary}`,
                borderRadius: token.borderRadiusLG,
                minWidth: 190,
                padding: "12px 14px",
              }}
            >
              <Text type="secondary" className="block text-xs">
                Active business
              </Text>
              <Text strong ellipsis style={{ display: "block" }}>
                {selectedBusiness?.name ?? "No business selected"}
              </Text>
            </div>
          </Flex>
        </div>

        <Row gutter={0}>
          <Col xs={24} md={8}>
            <div style={{ padding: 18 }}>
              <Text type="secondary">Accessible businesses</Text>
              <div className="mt-1 text-2xl font-semibold">
                {businesses.length}
              </div>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div
              style={{
                borderInline: `1px solid ${token.colorBorderSecondary}`,
                padding: 18,
              }}
            >
              <Text type="secondary">Account type</Text>
              <div className="mt-1 text-2xl font-semibold">{user.type}</div>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div style={{ padding: 18 }}>
              <Text type="secondary">Current status</Text>
              <div className="mt-1 text-2xl font-semibold">
                {user.status ?? "ACTIVE"}
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card title="Account Details">
            <Row gutter={[12, 12]}>
              <Col xs={24} md={12}>
                <FieldRow
                  icon={<IdcardOutlined />}
                  label="User ID"
                  value={user.id}
                />
              </Col>
              <Col xs={24} md={12}>
                <FieldRow
                  icon={<UserOutlined />}
                  label="Name"
                  value={user.name}
                />
              </Col>
              <Col xs={24} md={12}>
                <FieldRow
                  icon={<MailOutlined />}
                  label="Email"
                  value={user.email}
                />
              </Col>
              <Col xs={24} md={12}>
                <FieldRow
                  icon={<PhoneOutlined />}
                  label="Phone"
                  value={user.phone}
                />
              </Col>
              <Col xs={24} md={12}>
                <FieldRow
                  icon={<IdcardOutlined />}
                  label="User ID"
                  value={user.id}
                />
              </Col>
              <Col xs={24} md={12}>
                <FieldRow
                  icon={<UserOutlined />}
                  label="Last updated"
                  value={user.updatedAt}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card title="Businesses">
            {businesses.length ? (
              <Space direction="vertical" className="w-full" size={10}>
                {businesses.map((business) => (
                  <Flex
                    key={business.id}
                    align="center"
                    gap={12}
                    style={{
                      border: `1px solid ${token.colorBorderSecondary}`,
                      borderRadius: token.borderRadius,
                      padding: "12px 14px",
                    }}
                  >
                    <Avatar
                      size="small"
                      icon={<BankOutlined />}
                      style={{ background: token.colorPrimary }}
                    >
                      {business.name?.charAt(0).toUpperCase()}
                    </Avatar>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <Text strong ellipsis style={{ display: "block" }}>
                        {business.name}
                      </Text>
                      <Text type="secondary" className="text-xs">
                        ID {business.id}
                      </Text>
                    </div>
                    {business.id === selectedBusiness?.id && (
                      <Tag color="green" bordered={false}>
                        Active
                      </Tag>
                    )}
                  </Flex>
                ))}
              </Space>
            ) : (
              <Empty description="No businesses found" />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
