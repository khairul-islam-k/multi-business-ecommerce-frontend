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

export default function EditSupplierPage() {
  const { id } = useParams();
  const router = useRouter();
  const swal = useSwal();

  // -----------------------------
  // fetch supplier
  // -----------------------------
  const { data, isLoading } = useQuery({
    queryKey: ["supplier", id],
    queryFn: async () =>
      (await api.get(`/business-suppliers/${id}`)).data?.data,
  });

  const supplier = data;

  // -----------------------------
  // submit
  // -----------------------------
  const { handler, loading } = useSubmit(async (values: any) => {
    await api.patch(`/business-suppliers/${id}`, values);

    swal.success("Supplier updated!");

    queryClient.invalidateQueries({ queryKey: ["suppliers"] });

    router.push("/admin/dashboard/masters/suppliers");
  });

  if (isLoading) return <Loader />;
  if (!supplier) return notFound();

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Supplier" breadcrumb={adminBreadcrumb} />

      <Card>
        <Title level={5}>Edit Supplier</Title>

        <Form
          mode="edit"
          initialValues={supplier}
          onSubmit={handler}
          loading={loading}
        />
      </Card>
    </div>
  );
}
