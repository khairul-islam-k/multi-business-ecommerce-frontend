"use client";

import { Card, message, Typography } from "antd";
import { notFound, useParams, useRouter } from "next/navigation";

import Form from "../../_components/form";
import { mockCategories } from "../../data";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useSwal } from "@/hooks/use-swal";

const { Title } = Typography;

export default function EditCategoryPage() {
  const { id } = useParams();
  const router = useRouter();
  const swal = useSwal();

  const category = mockCategories.find((c) => c.id === id);

  if (!category) throw notFound();

  const handleSubmit = async (values: any) => {
    await new Promise((r) => setTimeout(r, 1000));
    swal.success("Category updated!");
    router.push("/admin/dashboard/masters/categories");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Category" breadcrumb={adminBreadcrumb} />

      <Card>
        <Title level={5}>Edit Category</Title>

        <Form mode="edit" initialValues={category} onSubmit={handleSubmit} />
      </Card>
    </div>
  );
}
