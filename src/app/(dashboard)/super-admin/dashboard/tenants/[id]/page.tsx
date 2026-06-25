"use client";

import {
  Landmark,
  Mail,
  Phone,
  UserRound
} from "lucide-react";


import { useParams } from "next/navigation";
import {
  Avatar,
  Card,
  Col,
  Descriptions,
  Empty,
  Flex,
  Row,
  Space,
  Statistic,
  Tag,
  Typography,
} from "antd";

import { useTenant } from "@/lib/api";
import Loader from "@/components/shared/loader";
import PageHeader from "@/components/shared/page-header";
import { superAdminBreadcrumb } from "@/config/breadcrumb.config";

const { Text, Title } = Typography;

const statusColor: Record<string, string> = {
  ACTIVE: "green",
  INACTIVE: "default",
  SUSPENDED: "red",
};

export default function TenantDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: tenant, isLoading, isError } = useTenant(id);
  const businesses = tenant?.ownedBusinesses ?? [];

  if (isLoading) {
    return (
      <Loader
        label="Loading tenant"
        description="Fetching the tenant profile and owned businesses."
      />
    );
  }

  if (isError || !tenant) {
    return <Empty description="Tenant not found" />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={tenant.name}
        subtitle="Tenant account, profile, and owned businesses from the backend tenant API."
        breadcrumb={superAdminBreadcrumb}
      />

      <Card styles={{ body: { padding: 0 } }} style={{ overflow: "hidden" }}>
        <div className="p-6">
          <Flex align="center" gap={18} wrap>
            <Avatar size={72} icon={<UserRound />}>
              {tenant.name?.charAt(0).toUpperCase()}
            </Avatar>
            <div className="min-w-0 flex-1">
              <Title level={3} ellipsis style={{ margin: 0 }}>
                {tenant.name}
              </Title>
              <Space wrap className="mt-2">
                <Tag color={statusColor[tenant.status ?? ""] ?? "default"}>
                  {tenant.status ?? "ACTIVE"}
                </Tag>
                <Text type="secondary">{tenant.type}</Text>
              </Space>
            </div>
          </Flex>
        </div>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="Owned Businesses" value={businesses.length} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Created"
              value={
                tenant.createdAt
                  ? new Date(tenant.createdAt).toLocaleDateString()
                  : "-"
              }
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Status"
              value={tenant.status ?? "ACTIVE"}
              formatter={(value) => (
                <Tag color={statusColor[String(value)] ?? "default"}>
                  {value}
                </Tag>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Account Information">
        <Descriptions bordered column={{ xs: 1, md: 2 }}>
          <Descriptions.Item label="Tenant ID">{tenant.id}</Descriptions.Item>
          <Descriptions.Item label="Email">{tenant.email}</Descriptions.Item>
          <Descriptions.Item label="Phone">
            {tenant.phone || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Updated">
            {tenant.updatedAt
              ? new Date(tenant.updatedAt).toLocaleString()
              : "-"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Profile">
        <Descriptions bordered column={{ xs: 1, md: 2 }}>
          <Descriptions.Item label="First Name">
            {tenant.profile?.firstName || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Last Name">
            {tenant.profile?.lastName || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Gender">
            {tenant.profile?.gender || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Date of Birth">
            {tenant.profile?.dateOfBirth || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Address">
            {tenant.profile?.address || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="City">
            {tenant.profile?.city || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Country">
            {tenant.profile?.country || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Bio">
            {tenant.profile?.bio || "-"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title={`Owned Businesses (${businesses.length})`}>
        {businesses.length ? (
          <Row gutter={[12, 12]}>
            {businesses.map((business) => (
              <Col xs={24} md={12} xl={8} key={business.id}>
                <Card size="small">
                  <Flex align="center" gap={12}>
                    <Avatar icon={<Landmark />}>
                      {business.name?.charAt(0).toUpperCase()}
                    </Avatar>
                    <div className="min-w-0 flex-1 space-x-1">
                      <Text strong ellipsis className="block">
                        {business.name}
                      </Text>
                      <Space size={8} wrap className="mt-1">
                        <Tag
                          color={
                            business.status === "ACTIVE" ? "green" : "blue"
                          }
                        >
                          {business.status ?? "TRIAL"}
                        </Tag>
                        {business.currencyCode && (
                          <Text type="secondary" className="text-xs">
                            {business.currencyCode}
                          </Text>
                        )}
                      </Space>
                    </div>
                  </Flex>
                  <div className="mt-3 space-y-1 text-sm text-gray-500">
                    <div>
                      <Mail /> {business.email || "-"}
                    </div>
                    <div>
                      <Phone /> {business.phone || "-"}
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Empty description="No owned businesses found" />
        )}
      </Card>
    </div>
  );
}
