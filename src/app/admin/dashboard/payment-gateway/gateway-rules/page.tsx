"use client";

import Link from "next/link";
import { Button } from "antd";
import { useState } from "react";
import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";

import { mockRules } from "./data";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import DataTable from "../_components/data-table";
import StatusBadge from "../_components/badge";
import CreateEditRuleModal from "./_components/create-edit-modal";

export default function GatewayRules() {
  const [data, setData] = useState(mockRules);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const handleCreate = (values: any) => {
    setData((prev) => [...prev, { id: Date.now().toString(), ...values }]);
  };

  const handleUpdate = (values: any) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === editing.id ? { ...item, ...values } : item,
      ),
    );
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Gateway Rules" breadcrumb={adminBreadcrumb} />

      <div className="flex items-center justify-end gap-3">
        <Link href="/admin/dashboard/payment-gateway/gateways">
          <Button icon={<ArrowLeftOutlined />}>Back to Gateways</Button>
        </Link>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          Add Rule
        </Button>
      </div>

      <DataTable
        data={data}
        columns={[
          { header: "Rule Name", accessor: (r: any) => <b>{r.name}</b> },
          { header: "Condition", dataIndex: "condition" },
          { header: "Gateway", dataIndex: "gateway" },
          {
            header: "Priority",
            dataIndex: "priority",
            className: "text-center",
          },
          {
            header: "Status",
            accessor: (r: any) => (
              <StatusBadge status={r.status} text={r.status.toUpperCase()} />
            ),
          },
          {
            header: "",
            accessor: (r: any) => (
              <Button
                type="link"
                onClick={() => {
                  setEditing(r);
                  setOpen(true);
                }}
              >
                Edit
              </Button>
            ),
          },
        ]}
      />

      {/* Shared Modal */}
      <CreateEditRuleModal
        open={open}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
        initialValues={editing}
        mode={editing ? "edit" : "create"}
        onSubmit={editing ? handleUpdate : handleCreate}
      />
    </div>
  );
}
