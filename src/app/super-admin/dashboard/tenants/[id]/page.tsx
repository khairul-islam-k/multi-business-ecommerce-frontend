"use client";

import { Row, Col, Tabs, message } from "antd";
import { useParams } from "next/navigation";

import PageHeader from "@/components/shared/page-header";
import { superAdminBreadcrumb } from "@/config/breadcrumb.config";

import useTenantDetail from "./_hooks/use-tenant-details";

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

  const { tenant, modules, featureState, toggleModule, toggleFeature } =
    useTenantDetail(id as string);

  return (
    <div className="space-y-6">
      <PageHeader title={tenant.business} breadcrumb={superAdminBreadcrumb} />

      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <TenantInfoCard tenant={tenant} />
        </Col>

        <Col xs={24} md={16}>
          <Tabs
            items={[
              { key: "overview", label: "Overview", children: <OverviewTab /> },
              {
                key: "companies",
                label: "Companies",
                children: <CompanyTable />,
              },
              { key: "usage", label: "Usage", children: <UsageTab /> },
              { key: "billing", label: "Billing", children: <BillingTable /> },
              {
                key: "modules",
                label: "Modules",
                children: (
                  <ModulesTab modules={modules} toggleModule={toggleModule} />
                ),
              },
              {
                key: "features",
                label: "Features",
                children: (
                  <FeaturesTab
                    featureState={featureState}
                    toggleFeature={toggleFeature}
                  />
                ),
              },
              { key: "logs", label: "Logs", children: <LogsTable /> },
            ]}
          />
        </Col>
      </Row>
    </div>
  );
}
