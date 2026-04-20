"use client";

import { Card, Typography } from "antd";
import { notFound, useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import Form from "../../_components/form";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useSwal } from "@/hooks/use-swal";
import useSubmit from "@/hooks/use-submit";
import api from "@/lib/axios";
import Loader from "@/components/shared/loader";
import { queryClient } from "@/providers/query-provider";

const { Title } = Typography;

export default function EditCategoryPage() {
  const { id: uuid } = useParams();
  const router = useRouter();
  const swal = useSwal();

  // -----------------------------
  // fetch category
  // -----------------------------
  const { data, isLoading } = useQuery({
    queryKey: ["category", uuid],
    queryFn: async () => (await api.get(`/categories/${uuid}`)).data?.data,
  });

  const category = data;

  // -----------------------------
  // submit
  // -----------------------------
  const { handler, loading } = useSubmit(async (values: any) => {
    await api.patch(`/categories/${uuid}`, values);

    swal.success("Category updated!");

    queryClient.invalidateQueries({ queryKey: ["categories"] });

    router.push("/admin/dashboard/masters/categories");
  });

  // -----------------------------
  // loading / guard
  // -----------------------------
  if (isLoading) return <Loader />;
  if (!category) return notFound();

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Category" breadcrumb={adminBreadcrumb} />

      <Card loading={loading}>
        <Title level={5}>Edit Category</Title>

        <Form
          mode="edit"
          initialValues={category}
          onSubmit={handler}
          loading={loading}
        />
      </Card>
    </div>
  );
}
