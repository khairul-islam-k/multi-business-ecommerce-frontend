"use client";

import { Card, message, Typography } from "antd";
import { useParams, useRouter } from "next/navigation";

import Form from "../../_components/form";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

interface TCompany {
  id: string;
  uuid: string;
  name: string;
  code: string;
  logo_url: string;
  status: "Active" | "Inactive";
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  country: string;
  domain: string;
  subdomain: string;
  website_id: string;
  default_currency: string;
  tenant_id: string;
  createdAt: string;
  updatedAt: string;
  created_by: string;
  updated_by: string;
}

const { Title } = Typography;

export default function EditCompanyPage() {
  const router = useRouter();
  const { id } = useParams();
  const [company, setCompany] = useState<TCompany>();

  const handleSubmit = async (values: any) => {
    await new Promise((r) => setTimeout(r, 1000));
    axios.patch(`http://localhost:5002/onecomm/api/v1/companies/${id}`,
      values
    ).then(res => {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Your is updated",
        showConfirmButton: false,
        timer: 1500
      });
    })
  };

  useEffect(() => {
    axios.get(`http://localhost:5002/onecomm/api/v1/companies/${id}`)
      .then(res => setCompany(res.data.data))
  }, [id])

  if (!company) {
    return <Card loading />;
  }


  return (
    <div className="space-y-6">
      <PageHeader title="Edit Company" breadcrumb={adminBreadcrumb} />

      <Card>
        <Title level={5}>Edit Company Details</Title>

        <Form mode="edit" initialValues={company} onSubmit={handleSubmit} />
      </Card>
    </div>
  );
}
