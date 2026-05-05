"use client";

import Link from "next/link";
import { Button } from "antd";
import { useState } from "react";
import { PlusOutlined, SettingOutlined } from "@ant-design/icons";

import { mockGateways } from "./data";
import StatusBadge from "../_components/badge";
import DataTable from "../_components/data-table";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          { header: "Gateway", accessor: (r: any) => <b>{r.name}</b> },
          { header: "Slug", dataIndex: "slug" },
          {
            header: "Status",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            accessor: (r: any) => (
              <StatusBadge status={r.status} text={r.status.toUpperCase()} />
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
