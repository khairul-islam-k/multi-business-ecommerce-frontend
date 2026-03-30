"use client";

import { Card, message, Typography } from "antd";
import { notFound, useParams, useRouter } from "next/navigation";

import Form from "../../_components/form";
import { mockBrands } from "../../data";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const { Title } = Typography;

export default function EditBrandPage() {
  const { id } = useParams();
  const router = useRouter();

  const brand = mockBrands.find((b) => b.id === id);

  if (!brand) throw notFound();

  const handleSubmit = async (values: any) => {
    await new Promise((r) => setTimeout(r, 1000));
    message.success("Brand updated!");
    router.push("/admin/dashboard/brands");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Brand" breadcrumb={adminBreadcrumb} />

      <Card>
        <Title level={5}>Edit Brand</Title>

        <Form mode="edit" initialValues={brand} onSubmit={handleSubmit} />
      </Card>
    </div>
  );
}
