"use client";

import { Card, message, Typography } from "antd";
import { notFound, useParams, useRouter } from "next/navigation";
import Form from "../../_components/form";
import { mockSuppliers } from "../../data";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const { Title } = Typography;

export default function EditSupplierPage() {
  const { id } = useParams();
  const router = useRouter();

  const supplier = mockSuppliers.find((s) => s.id === id);
  if (!supplier) throw notFound();

  const handleSubmit = async (values: any) => {
    await new Promise((r) => setTimeout(r, 1000));
    message.success("Supplier updated!");
    router.push("/admin/dashboard/masters/suppliers");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Supplier" breadcrumb={adminBreadcrumb} />
      <Card>
        <Title level={5}>Edit Supplier</Title>
        <Form mode="edit" initialValues={supplier} onSubmit={handleSubmit} />
      </Card>
    </div>
  );
}
