"use client";

import { useEffect, useState } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useParams, useRouter } from "next/navigation";
import {
  Badge,
  Card,
  Col,
  Image,
  Row,
  Space,
  Typography,
  Divider,
  Button,
} from "antd";

import api from "@/lib/axios";

const { Title, Text } = Typography;

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

// const company = {
//     "id": "3",
//     "uuid": "550e8400-e29b-41d4-a716-446655440000",
//     "createdAt": "2026-04-16T04:07:59.725Z",
//     "updatedAt": "2026-04-16T04:07:59.726Z",
//     "deletedAt": null,
//     "created_by": "1",
//     "updated_by": "1",
//     "deleted_by": "1",
//     "tenant_id": "1",
//     "name": "OneComm Ltd",
//     "code": "ONECOMM",
//     "logo_url": "https://cdn.onecomm.com/logo.png",
//     "email": "info@onecomm.com",
//     "phone": "+8801712345678",
//     "address": "Banani, Dhaka",
//     "district": "Dhaka",
//     "city": "Dhaka",
//     "country": "Bangladesh",
//     "domain": "onecomm.com",
//     "subdomain": "app.onecomm.com",
//     "website_id": "101",
//     "default_currency": "USD",
//     "status": "Active"
// }

const InfoItem = ({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) => (
  <div>
    <Text type="secondary" style={{ fontSize: 12 }}>
      {label}
    </Text>
    <div style={{ fontSize: 14, fontWeight: 500 }}>{value || "—"}</div>
  </div>
);

export default function CompanyDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const [company, setCompanies] = useState<TCompany>();
  // console.log('use',company)

  useEffect(() => {
    api
      .get(`http://localhost:5002/onecomm/api/v1/companies/${id}`)
      .then((res) => setCompanies(res.data.data));
  }, [id]);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <Space style={{ marginBottom: 24 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
          Back
        </Button>
        <Title level={3} style={{ margin: 0 }}>
          Company Details
        </Title>
      </Space>

      {/* Top Card */}
      <Card style={{ textAlign: "center" }}>
        <Image
          src={company?.logo_url}
          alt={company?.name}
          width={140}
          height={140}
          style={{
            objectFit: "contain",
            borderRadius: 12,
            border: "1px solid #eee",
            marginBottom: 16,
          }}
          fallback="/no-image.png"
        />

        <Title level={2} style={{ marginBottom: 4 }}>
          {company?.name}
        </Title>

        <Text type="secondary">
          Code: <b>{company?.code}</b>
        </Text>

        <div style={{ marginTop: 12 }}>
          <Badge
            status={company?.status === "Active" ? "success" : "default"}
            text={company?.status}
          />
        </div>
      </Card>

      <Divider />

      {/* Main Info */}
      <Card title="Company Information">
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <InfoItem
              label="Default Currency"
              value={company?.default_currency}
            />
          </Col>
          <Col xs={24} md={8}>
            <InfoItem label="Website ID" value={company?.website_id} />
          </Col>

          <Col xs={24} md={8}>
            <InfoItem label="Domain" value={company?.domain} />
          </Col>
          <Col xs={24} md={8}>
            <InfoItem label="Subdomain" value={company?.subdomain} />
          </Col>
          <Col xs={24} md={8}>
            <InfoItem label="Tenant ID" value={company?.tenant_id} />
          </Col>
        </Row>
      </Card>

      <Divider />

      {/* Contact Info */}
      <Card title="Contact Information">
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <InfoItem label="Email" value={company?.email} />
          </Col>
          <Col xs={24} md={8}>
            <InfoItem label="Phone" value={company?.phone} />
          </Col>
          <Col xs={24} md={8}>
            <InfoItem label="Address" value={company?.address} />
          </Col>

          <Col xs={24} md={8}>
            <InfoItem label="City" value={company?.city} />
          </Col>
          <Col xs={24} md={8}>
            <InfoItem label="District" value={company?.district} />
          </Col>
          <Col xs={24} md={8}>
            <InfoItem label="Country" value={company?.country} />
          </Col>
        </Row>
      </Card>

      <Divider />

      {/* Audit Info */}
      <Card title="Audit Information">
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <InfoItem
              label="Created At"
              value={
                company?.createdAt
                  ? new Date(company.createdAt).toLocaleString()
                  : "-"
              }
            />
          </Col>

          <Col xs={24} md={12}>
            <InfoItem
              label="Updated At"
              value={
                company?.updatedAt
                  ? new Date(company.updatedAt).toLocaleString()
                  : "-"
              }
            />
          </Col>

          <Col xs={24} md={12}>
            <InfoItem label="Created By" value={company?.created_by} />
          </Col>
          <Col xs={24} md={12}>
            <InfoItem label="Updated By" value={company?.updated_by} />
          </Col>
        </Row>
      </Card>
    </div>
  );
}
