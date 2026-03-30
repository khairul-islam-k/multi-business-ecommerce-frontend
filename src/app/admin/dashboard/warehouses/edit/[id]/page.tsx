"use client";

import { Card, message, Typography } from "antd";
import { notFound, useParams, useRouter } from "next/navigation";

import Form from "../../_components/form";
import { mockWarehouses } from "../../data";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const { Title } = Typography;

export default function EditWarehousePage() {
  const { id } = useParams();
  const router = useRouter();

  const warehouse = mockWarehouses.find((w) => w.id === id);
  if (!warehouse) throw notFound();

  const handleSubmit = async (values: any) => {
    await new Promise((r) => setTimeout(r, 1000));
    message.success("Warehouse updated!");
    router.push("/admin/dashboard/warehouses");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Warehouse" breadcrumb={adminBreadcrumb} />

      <Card>
        <Title level={5}>Edit Warehouse</Title>
        <Form mode="edit" initialValues={warehouse} onSubmit={handleSubmit} />
      </Card>
    </div>
  );
}
