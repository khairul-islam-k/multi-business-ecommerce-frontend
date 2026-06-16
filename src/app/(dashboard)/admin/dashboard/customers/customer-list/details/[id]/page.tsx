"use client";

import React from "react";
import {
  ArrowLeftOutlined,
  EditOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Empty,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import { useParams, useRouter } from "next/navigation";

import PageHeader from "@/components/shared/page-header";
import Loader from "@/components/shared/loader";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useCustomer } from "@/lib/api/hooks/customer";
import { useAuthStore } from "@/stores/auth.store";
import Address from "../_components/Address";

const { Title, Text } = Typography;

type CustomerStatus = "ACTIVE" | "INACTIVE" | "BLOCKED";

type CustomerAddressType =
  | "HOME"
  | "OFFICE"
  | "SHIPPING"
  | "BILLING"
  | "OTHER";

type CustomerAddress = {
  id: string;
  customerId: string;
  addressType: CustomerAddressType;
  name: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

type CustomerDetailsResponse = {
  id: string;
  businessId: string;
  name: string;
  email: string | null;
  phone: string | null;
  status: CustomerStatus;
  note: string | null;
  createdBy: string;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  addresses: CustomerAddress[];
  _count: {
    carts: number;
    orders: number;
  };
};

const getStatusColor = (status?: CustomerStatus) => {
  if (status === "ACTIVE") return "green";
  if (status === "BLOCKED") return "red";
  return "orange";
};

const formatDate = (date?: string | null) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString();
};

const formatDateTime = (date?: string | null) => {
  if (!date) return "-";
  return new Date(date).toLocaleString();
};

const CustomerDetails = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const { data: customer, isLoading, isFetching } = useCustomer(businessId, id);

  const item = customer as CustomerDetailsResponse | undefined;

  if (isLoading || isFetching) {
    return <Loader />;
  }

  if (!item) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Customer Details"
          subtitle="View customer information, contact details, orders, carts, and addresses."
          breadcrumb={adminBreadcrumb}
        />

        <Card>
          <Empty description="Customer not found" />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={item.name}
        subtitle="View customer information, contact details, orders, carts, and addresses."
        breadcrumb={adminBreadcrumb}
      />

      <Card>
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Title level={4} style={{ marginBottom: 4 }}>
              {item.name}
            </Title>

            <Space wrap>
              <Text type="secondary">Customer since {formatDate(item.createdAt)}</Text>

              <Tag color={getStatusColor(item.status)}>{item.status}</Tag>
            </Space>
          </div>

          <Space wrap>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() =>
                router.push("/admin/dashboard/customers/customer-list")
              }
            >
              Back
            </Button>

            <Button
              icon={<EnvironmentOutlined />}
              onClick={() =>
                router.push(
                  `/admin/dashboard/customers/customer-list/address/${id}`
                )
              }
            >
              Add Address
            </Button>

            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() =>
                router.push(
                  `/admin/dashboard/customers/customer-list/update/${item.id}`
                )
              }
            >
              Edit
            </Button>
          </Space>
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="Customer Information" size="small">
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="Name">
                  {item.name}
                </Descriptions.Item>

                <Descriptions.Item label="Email">
                  {item.email ?? "-"}
                </Descriptions.Item>

                <Descriptions.Item label="Phone">
                  {item.phone ?? "-"}
                </Descriptions.Item>

                <Descriptions.Item label="Status">
                  <Tag color={getStatusColor(item.status)}>{item.status}</Tag>
                </Descriptions.Item>

                <Descriptions.Item label="Note">
                  {item.note ?? "-"}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Activity Summary" size="small">
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="Total Orders">
                  {item._count?.orders ?? 0}
                </Descriptions.Item>

                <Descriptions.Item label="Total Carts">
                  {item._count?.carts ?? 0}
                </Descriptions.Item>

                <Descriptions.Item label="Total Addresses">
                  {item.addresses?.length ?? 0}
                </Descriptions.Item>

                <Descriptions.Item label="Created At">
                  {formatDateTime(item.createdAt)}
                </Descriptions.Item>

                <Descriptions.Item label="Updated At">
                  {formatDateTime(item.updatedAt)}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          <Col xs={24}>
          <Address address={item?.addresses ?? []} 
          customerId={id}
          />
          </Col>


        </Row>
      </Card>
    </div>
  );
};

export default CustomerDetails;