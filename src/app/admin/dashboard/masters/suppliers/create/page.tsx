"use client";

import { Card, message, Typography } from "antd";
import { useRouter } from "next/navigation";
import Form from "../_components/form";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useSwal } from "@/hooks/use-swal";

const { Title } = Typography;

export default function CreateSupplierPage() {
  const router = useRouter();
  const swal = useSwal();

  const handleSubmit = async (values: any) => {
    await new Promise((r) => setTimeout(r, 1000));
    swal.success("Supplier created!");
    router.push("/admin/dashboard/masters/suppliers");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Create Supplier" breadcrumb={adminBreadcrumb} />
      <Card>
        <Title level={5}>New Supplier</Title>
        <Form mode="add" onSubmit={handleSubmit} />
      </Card>
    </div>
  );
}
