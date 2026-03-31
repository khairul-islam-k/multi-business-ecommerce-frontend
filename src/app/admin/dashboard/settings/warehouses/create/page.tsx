"use client";

import { Card, message, Typography } from "antd";
import { useRouter } from "next/navigation";

import Form from "../_components/form";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const { Title } = Typography;

export default function CreateWarehousePage() {
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    await new Promise((r) => setTimeout(r, 1000));
    message.success("Warehouse created!");
    router.push("/admin/dashboard/settings/warehouses");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Create Warehouse" breadcrumb={adminBreadcrumb} />

      <Card>
        <Title level={5}>New Warehouse</Title>
        <Form mode="add" onSubmit={handleSubmit} />
      </Card>
    </div>
  );
}
