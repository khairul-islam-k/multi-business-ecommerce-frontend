"use client";

import { Card, Typography } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import api from "@/lib/axios";
import Form from "../../_components/form";
import { useSwal } from "@/hooks/use-swal";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

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
  const swal = useSwal();
  const { id } = useParams();
  const [company, setCompany] = useState<TCompany>();

  const handleSubmit = async (values: any) => {
    await new Promise((r) => setTimeout(r, 1000));
    api
      .patch(`http://localhost:5002/onecomm/api/v1/companies/${id}`, values)
      .then((res) => {
        swal.success("Your is updated");
      });
  };

  useEffect(() => {
    api
      .get(`http://localhost:5002/onecomm/api/v1/companies/${id}`)
      .then((res) => setCompany(res.data.data));
  }, [id]);

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
