"use client";

import { Card, Typography } from "antd";
import { useRouter } from "next/navigation";

import Form from "../_components/form";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useSwal } from "@/hooks/use-swal";
import useSubmit from "@/hooks/use-submit";
import api from "@/lib/axios";
import { queryClient } from "@/providers/query-provider";

const { Title } = Typography;

export default function CreateSupplierPage() {
  const router = useRouter();
  const swal = useSwal();

  const { handler, loading } = useSubmit(async (values: any) => {
    await api.post("/business-suppliers", values);

    swal.success("Supplier created!");

    queryClient.invalidateQueries({ queryKey: ["suppliers"] });

    router.push("/admin/dashboard/masters/suppliers");
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Create Supplier" breadcrumb={adminBreadcrumb} />

      <Card>
        <Title level={5}>New Supplier</Title>

        <Form mode="add" onSubmit={handler} loading={loading} />
      </Card>
    </div>
  );
}
