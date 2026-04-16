"use client";

import { Row, Col, Tabs } from "antd";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import PageHeader from "@/components/shared/page-header";
import { superAdminBreadcrumb } from "@/config/breadcrumb.config";
import Loader from "@/components/shared/loader";
import api from "@/lib/axios";

import TenantInfoCard from "./_components/tenant-info-card";
import OverviewTab from "./_components/overview-tab";
import UsageTab from "./_components/usage-tab";
import ModulesTab from "./_components/modules-tab";
import FeaturesTab from "./_components/features-tab";
import CompanyTable from "./_components/company-table";
import BillingTable from "./_components/billing-table";
import LogsTable from "./_components/logs-table";

export default function TenantDetailPage() {
  const { id } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["tenant-details", id],
    queryFn: async () => api.get(`/auth-tenant/${id}`).then((res) => res.data),
    enabled: !!id,
  });

  if (isLoading) return <Loader />;

  if (error) return <div>Failed to load tenant</div>;

  const tenant = data?.data;

  return (
    <div className="space-y-6">
      <PageHeader
        title={tenant?.business_name || "Tenant Details"}
        breadcrumb={superAdminBreadcrumb}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <TenantInfoCard tenant={tenant} />
        </Col>

        <Col xs={24} md={16}>
          <Tabs
            items={[
              {
                key: "overview",
                label: "Overview",
                children: <OverviewTab tenant={tenant} />,
              },
              {
                key: "companies",
                label: "Companies",
                children: <CompanyTable tenantId={String(id)} />,
              },
              {
                key: "usage",
                label: "Usage",
                children: <UsageTab tenant={tenant} />,
              },
              {
                key: "billing",
                label: "Billing",
                children: <BillingTable tenantId={String(id)} />,
              },
              {
                key: "modules",
                label: "Modules",
                children: <ModulesTab modules={tenant?.modules || []} />,
              },
              {
                key: "features",
                label: "Features",
                children: <FeaturesTab features={tenant?.features || []} />,
              },
              {
                key: "logs",
                label: "Logs",
                children: <LogsTable tenantId={String(id)} />,
              },
            ]}
          />
        </Col>
      </Row>
    </div>
  );
}
