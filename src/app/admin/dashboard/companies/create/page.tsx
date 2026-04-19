"use client";
import Swal from 'sweetalert2'
import { Card, Typography } from "antd";
import { useRouter } from "next/navigation";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import Form from "../_components/form";
import axios from "axios";
import { useAuthStore } from '@/stores/auth.store';

const { Title } = Typography;

export default function AddCompanyPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  console.log(typeof(user?.id))
  const initialValues = {
    default_currency: "BDT",
    status: "Active"


  };

  const handleSubmit = async (values: any) => {
    await new Promise((r) => setTimeout(r, 1000));
    const tenant_id = 30;
    const created_by = 30;
    const postData = {...values};
    const res = await axios.post('http://localhost:5002/onecomm/api/v1/companies',
      postData
    );
// "tenant_id": 1,
    // tenant_id
    // website_id
    // create_by
    // updated_by
    // deleted_by

    if (res.data?.success) {
      router.push('/admin/dashboard/companies');
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
