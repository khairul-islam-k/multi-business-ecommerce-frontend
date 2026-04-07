"use client";

import { Card, message, Typography } from "antd";
import { useRouter } from "next/navigation";

import Form from "../_components/form";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const { Title } = Typography;

export default function CreateCategoryPage() {
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    await new Promise((r) => setTimeout(r, 1000));
    message.success("Category created!");
    router.push("/admin/dashboard/masters/categories");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Create Category" breadcrumb={adminBreadcrumb} />

      <Card>
        <Title level={5}>New Category</Title>
        <Form mode="add" onSubmit={handleSubmit} />
      </Card>
    </div>
  );
}
