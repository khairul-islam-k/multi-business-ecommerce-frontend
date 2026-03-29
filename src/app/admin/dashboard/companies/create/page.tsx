"use client";

import { Card, message, Typography } from "antd";
import { useRouter } from "next/navigation";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import Form from "../_components/form";

const { Title } = Typography;

export default function AddCompanyPage() {
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    await new Promise((r) => setTimeout(r, 1000));
    message.success("Company created successfully!");
    router.push("/admin/dashboard/companies");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Add Company" breadcrumb={adminBreadcrumb} />

      <Card>
        <Title level={5}>Create New Company</Title>

        <Form mode="add" onSubmit={handleSubmit} />
      </Card>
    </div>
  );
}
