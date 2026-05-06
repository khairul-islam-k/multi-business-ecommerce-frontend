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

export default function CreateSupplierPage() {
  const router = useRouter();
  const swal = useSwal();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
