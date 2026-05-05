"use client";

import { Card, Typography } from "antd";
import { useRouter } from "next/navigation";

import axios from "axios";
import Form from "../_components/form";
import { useSwal } from "@/hooks/use-swal";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const { Title } = Typography;

export default function AddCompanyPage() {
  const swal = useSwal();
  const router = useRouter();

  const initialValues = {
    default_currency: "BDT",
    status: "Active",
  };

  const handleSubmit = async (values: any) => {
    await new Promise((r) => setTimeout(r, 1000));
    const postData = { ...values };
    const res = await axios.post(
      "http://localhost:5002/onecomm/api/v1/companies",
      postData,
    );

    if (res.data?.success) {
      router.push("/admin/dashboard/companies");
      swal.success("Your work has been saved");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Add Company" breadcrumb={adminBreadcrumb} />

      <Card>
        <Title level={5}>Create New Company</Title>

        <Form
          mode="add"
          onSubmit={handleSubmit}
          initialValues={initialValues}
        />
      </Card>
    </div>
  );
}
