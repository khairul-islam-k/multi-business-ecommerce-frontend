"use client";

import { Card, Typography } from "antd";
import { useRouter } from "next/navigation";

import api from "@/lib/axios";
import Form from "../_components/form";
import { useSwal } from "@/hooks/use-swal";
import useSubmit from "@/hooks/use-submit";
import { queryClient } from "@/providers/query-provider";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const { Title } = Typography;

export default function CreateCategoryPage() {
  const swal = useSwal();
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { handler, loading } = useSubmit(async (values: any) => {
    await api.post("/categories", values);

    swal.success("Category created!");

    queryClient.invalidateQueries({ queryKey: ["categories"] });

    router.push("/admin/dashboard/masters/categories");
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Create Category" breadcrumb={adminBreadcrumb} />

      <Card loading={loading}>
        <Title level={5}>New Category</Title>

        <Form mode="add" onSubmit={handler} loading={loading} />
      </Card>
    </div>
  );
}
