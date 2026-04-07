"use client";

import { Card, message, Typography } from "antd";
import { notFound, useParams, useRouter } from "next/navigation";

import Form from "../../_components/form";
import { mockShowrooms } from "../../data";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const { Title } = Typography;

export default function EditShowroomPage() {
  const { id } = useParams();
  const router = useRouter();

  const showroom = mockShowrooms.find((s) => s.id === id);
  if (!showroom) throw notFound();

  const handleSubmit = async (values: any) => {
    await new Promise((r) => setTimeout(r, 1000));
    message.success("Showroom updated!");
    router.push("/admin/dashboard/masters/showrooms");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Showroom" breadcrumb={adminBreadcrumb} />

      <Card>
        <Title level={5}>Edit Showroom</Title>
        <Form mode="edit" initialValues={showroom} onSubmit={handleSubmit} />
      </Card>
    </div>
  );
}
