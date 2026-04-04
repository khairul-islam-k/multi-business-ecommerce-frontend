"use client";

import Link from "next/link";
import { Button } from "antd";
import { PlusOutlined, SettingOutlined } from "@ant-design/icons";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import DataTable from "../_components/data-table";
import StatusBadge from "../_components/badge";
import { mockGateways } from "./data";
import { useState } from "react";
import CreateGatewayModal from "../_components/create-modal";

export default function PaymentGatewayList() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader title="Payment Gateways" breadcrumb={adminBreadcrumb} />

      <div className="flex items-center justify-end gap-4">
        <Link href="/admin/dashboard/payment-gateway/configurations">
          <Button icon={<SettingOutlined />}>Configurations</Button>
        </Link>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setOpen(true)}
        >
          Add Gateway
        </Button>
      </div>

      <DataTable
        data={mockGateways}
        columns={[
          { header: "Gateway", accessor: (r: any) => <b>{r.name}</b> },
          { header: "Slug", dataIndex: "slug" },
          {
            header: "Status",
            accessor: (r: any) => (
              <StatusBadge status={r.status.toUpperCase()} />
            ),
          },
          {
            header: "Transactions",
            dataIndex: "transactions",
            className: "text-right",
          },
          { header: "Volume", dataIndex: "volume", className: "text-right" },
          {
            header: "",
            accessor: () => <Button type="link">Configure</Button>,
          },
        ]}
      />

      <CreateGatewayModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
