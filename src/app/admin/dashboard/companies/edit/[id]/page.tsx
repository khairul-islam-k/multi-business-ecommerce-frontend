"use client";

import { Card, message, Typography } from "antd";
import { notFound, useParams, useRouter } from "next/navigation";

import Form from "../../_components/form";
import { mockCompanies } from "../../data";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const { Title } = Typography;

export default function EditCompanyPage() {
  const router = useRouter();
  const { id } = useParams();

  const company = mockCompanies.find((c) => c.id === id);

  const handleSubmit = async (values: any) => {
    await new Promise((r) => setTimeout(r, 1000));
    message.success("Company updated successfully!");
    router.push("/admin/dashboard/companies");
  };

  if (!id || !company) throw notFound();

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
