"use client";

import {
  ArrowLeft,
  Save
} from "lucide-react";


import Link from "next/link";
import { Button, Card, Input, Switch } from "antd";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

export default function CODSettings() {
  return (
    <div className="space-y-6">
      <PageHeader title="COD Settings" breadcrumb={adminBreadcrumb} />

      <div className="flex items-center justify-end gap-3">
        <Link href="/admin/dashboard/payment-gateway/gateways">
          <Button icon={<ArrowLeft />}>Back to Gateways</Button>
        </Link>
        <Button type="primary" icon={<Save />}>
          Save Settings
        </Button>
      </div>

      <div className="w-full space-y-6">
        {/* Enable COD */}
        <Card>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Enable COD</h3>
              <p className="text-sm text-gray-500">
                Allow customers to pay on delivery
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </Card>

        {/* Order Limits */}
        <Card title="Order Limits">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input addonBefore="Min Amount" defaultValue={200} type="number" />
            <Input
              addonBefore="Max Amount"
              defaultValue={25000}
              type="number"
            />
          </div>
        </Card>

        {/* COD Fee */}
        <Card title="COD Fee">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input defaultValue="Fixed" addonBefore="Fee Type" />
            <Input type="number" defaultValue={40} addonBefore="Fee Amount" />
          </div>
        </Card>

        {/* Restrictions */}
        <Card title="Restrictions">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Restrict by pincode</span>
              <Switch defaultChecked />
            </div>
            <div className="flex justify-between">
              <span>First-time customers</span>
              <Switch />
            </div>
            <div className="flex justify-between">
              <span>By product category</span>
              <Switch />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
