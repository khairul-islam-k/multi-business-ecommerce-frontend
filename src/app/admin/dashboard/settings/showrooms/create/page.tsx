"use client";

import { Card, message, Typography } from "antd";
import { useRouter } from "next/navigation";

import Form from "../_components/form";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const { Title } = Typography;

export default function CreateShowroomPage() {
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    await new Promise((r) => setTimeout(r, 1000));
    message.success("Showroom created!");
    router.push("/admin/dashboard/settings/showrooms");
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
