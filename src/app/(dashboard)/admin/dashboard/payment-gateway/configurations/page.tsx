"use client";

import {
  ArrowLeft,
  Save
} from "lucide-react";


import Link from "next/link";
import { Button, Card, Input, Switch } from "antd";

import { mockConfig } from "./data";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

export default function PaymentGatewayConfigurations() {
  return (
    <div className="space-y-6">
      <PageHeader title="Gateway Configurations" breadcrumb={adminBreadcrumb} />

      <div className="flex items-center justify-end gap-3">
        <Link href="/admin/dashboard/payment-gateway/gateways">
          <Button icon={<ArrowLeft />}>Back to Gateways</Button>
        </Link>
        <Button type="primary" icon={<Save />}>
          Save All
        </Button>
      </div>

      <div className="space-y-4">
        {mockConfig.map((config) => (
          <Card key={config.id}>
            <div className="flex justify-between mb-4">
              <h3 className="font-semibold">{config.name}</h3>
              <Switch defaultChecked={config.enabled} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Input placeholder="API Key" defaultValue={config.keyId} />
              <Input.Password
                placeholder="API Secret"
                defaultValue={config.keySecret}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
