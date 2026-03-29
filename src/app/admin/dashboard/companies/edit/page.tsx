"use client";

import { Card, message, Typography } from "antd";
import { useRouter, useSearchParams } from "next/navigation";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import Form from "../_components/form";
import { mockCompanies } from "../data";

const { Title } = Typography;

export default function EditCompanyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const company = mockCompanies.find((c) => c.id === id);

  const handleSubmit = async (values: any) => {
    await new Promise((r) => setTimeout(r, 1000));
    message.success("Company updated successfully!");
    router.push("/admin/dashboard/companies");
  };

  if (!id || !company) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Typography.Text type="danger">
          {id ? "Company not found" : "Invalid company ID"}
        </Typography.Text>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Company" breadcrumb={adminBreadcrumb} />

      <Card>
        <Title level={5}>Edit Company Details</Title>

        <Form mode="edit" initialValues={company} onSubmit={handleSubmit} />
      </Card>
    </div>
  );
}
