"use client";

import { Card, Typography } from "antd";
import { useRouter } from "next/navigation";

import api from "@/lib/axios";
import Form from "../_components/form";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useSwal } from "@/hooks/use-swal";

const { Title } = Typography;

export default function CreateShowroomPage() {
  const router = useRouter();
  const swal = useSwal();

  const handleSubmit = async (values: any) => {
    await api.post("/business-showrooms", {
      tenant_id: 1,
      company_id: 10,
      ...values,
    });

    swal.success("Showroom created!");
    router.push("/admin/dashboard/masters/showrooms");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Create Showroom" breadcrumb={adminBreadcrumb} />

      <Card>
        <Title level={5}>New Showroom</Title>
        <Form mode="add" onSubmit={handleSubmit} />
      </Card>
    </div>
  );
}
