"use client";

import { useParams } from "next/navigation";
import { Card, Col, Descriptions, Empty, Row, Spin, Statistic, Tag } from "antd";

import { useBusiness } from "@/lib/api";
import PageHeader from "@/components/shared/page-header";
import { superAdminBreadcrumb } from "@/config/breadcrumb.config";

export default function TenantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const businessId = id;

  const { data: business, isLoading, isError } = useBusiness(businessId);

  if (isLoading) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (isError || !business) {
    return <Empty description="Business not found" />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={business.name}
        subtitle="Business details from the backend businesses API."
        breadcrumb={superAdminBreadcrumb}
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="Members" value={business._count?.members ?? 0} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="Roles" value={business._count?.roles ?? 0} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Status"
              value={business.status ?? "TRIAL"}
              formatter={(value) => (
                <Tag color={value === "ACTIVE" ? "green" : "blue"}>
                  {value}
                </Tag>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Business Information">
        <Descriptions bordered column={{ xs: 1, md: 2 }}>
          <Descriptions.Item label="ID">{business.id}</Descriptions.Item>
          <Descriptions.Item label="Slug">
            {business.slug || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {business.email || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Phone">
            {business.phone || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Country">
            {business.country || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Currency">
            {business.currencyCode || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Timezone">
            {business.timezone || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Owner">
            {business.ownerUser?.name ?? `User #${business.ownerUserId ?? "-"}`}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Branding">
        <Descriptions bordered column={{ xs: 1, md: 2 }}>
          <Descriptions.Item label="Primary Color">
            {business.branding?.primaryColor || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Accent Color">
            {business.branding?.accentColor || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="SEO Title">
            {business.branding?.seoTitle || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="SEO Description">
            {business.branding?.seoDescription || "-"}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
