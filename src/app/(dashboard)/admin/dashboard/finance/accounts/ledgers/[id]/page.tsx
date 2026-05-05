"use client";

import { mockLedgers } from "../data";
import { notFound, useParams } from "next/navigation";
import { Card, Tag, Button, Descriptions } from "antd";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

export default function LedgerDetailsPage() {
  const params = useParams();

  const ledger = mockLedgers.find((l) => l.id === params.id);

  if (!ledger) return notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Ledger Details - ${ledger.name}`}
        breadcrumb={adminBreadcrumb}
      />

      <Card>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Ledger ID">{ledger.id}</Descriptions.Item>

          <Descriptions.Item label="Name">{ledger.name}</Descriptions.Item>

          <Descriptions.Item label="Type">{ledger.type}</Descriptions.Item>

          <Descriptions.Item label="Status">
            <Tag color={ledger.status === "Active" ? "green" : "red"}>
              {ledger.status}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Total Entries">
            {ledger.entries}
          </Descriptions.Item>
        </Descriptions>

        <div className="mt-6 flex gap-2">
          <Button type="primary">Edit Ledger</Button>
          <Button danger>Delete</Button>
        </div>
      </Card>
    </div>
  );
}
