"use client";

import { Card, Typography } from "antd";
import { notFound, useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import Form from "../../_components/form";
import { useSwal } from "@/hooks/use-swal";
import useSubmit from "@/hooks/use-submit";
import Loader from "@/components/shared/loader";
import { queryClient } from "@/providers/query-provider";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const { Title } = Typography;

export default function EditCategoryPage() {
  const swal = useSwal();
  const router = useRouter();
  const { id: uuid } = useParams();

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
