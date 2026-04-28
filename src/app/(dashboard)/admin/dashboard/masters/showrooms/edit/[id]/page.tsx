"use client";

import { Card, Typography } from "antd";
import { notFound, useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import Form from "../../_components/form";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useSwal } from "@/hooks/use-swal";
import Loader from "@/components/shared/loader";

const { Title } = Typography;

export default function EditShowroomPage() {
  const { id } = useParams();
  const router = useRouter();
  const swal = useSwal();

  const { data, isLoading } = useQuery({
    queryKey: ["showroom", id],
    queryFn: async () =>
      api.get(`/business-showrooms/${id}`).then((res) => res.data.data),
    enabled: !!id,
  });

  if (isLoading) return <Loader />;
  if (!data) throw notFound();

  const handleSubmit = async (values: any) => {
    await api.patch(`/business-showrooms/${id}`, values);

    swal.success("Showroom updated!");
    router.push("/admin/dashboard/masters/showrooms");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Showroom" breadcrumb={adminBreadcrumb} />

      <Card>
        <Title level={5}>Edit Showroom</Title>

        <Form mode="edit" initialValues={data} onSubmit={handleSubmit} />
      </Card>
    </div>
  );
}
