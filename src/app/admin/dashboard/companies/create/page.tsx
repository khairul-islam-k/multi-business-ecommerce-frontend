"use client";
import Swal from 'sweetalert2'
import { Card, Typography } from "antd";
import { useRouter } from "next/navigation";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import Form from "../_components/form";
import axios from "axios";

const { Title } = Typography;

export default function AddCompanyPage() {
  const router = useRouter();

  const initialValues = {
    default_currency: "BDT",
    status: "Active"


  };

  const handleSubmit = async (values: any) => {
    await new Promise((r) => setTimeout(r, 1000));
    console.log(values);
    const res = await axios.post('http://localhost:5002/onecomm/api/v1/companies',
      values
    );

    if (res.data?.success) {
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Your work has been saved',
        showConfirmButton: false,
        timer: 1500,
      });
    }

  };

  return (
    <div className="space-y-6">
      <PageHeader title="Add Company" breadcrumb={adminBreadcrumb} />

      <Card>
        <Title level={5}>Create New Company</Title>

        <Form mode="add" onSubmit={handleSubmit} initialValues={initialValues} />
      </Card>
    </div>
  );
}
