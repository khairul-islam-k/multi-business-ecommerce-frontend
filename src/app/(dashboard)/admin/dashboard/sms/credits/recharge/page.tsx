"use client";

import {
  CreditCard,
  Zap
} from "lucide-react";


import PageHeader from "@/components/shared/page-header";
import { Card, Button, InputNumber, Form, Tag } from "antd";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useSwal } from "@/hooks/use-swal";

const plans = [
  { credits: 1000, price: 25, popular: false },
  { credits: 5000, price: 100, popular: true },
  { credits: 10000, price: 180, popular: false },
];

export default function RechargeSmsCredits() {
  const swal = useSwal();
  const [form] = Form.useForm();

  const purchase = (credits: number) => {
    swal.success(`${credits} credits purchased!`);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Recharge SMS Credits" breadcrumb={adminBreadcrumb} />

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        {plans.map((p) => (
          <Card key={p.credits} className={p.popular ? "border-blue-500" : ""}>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">
                {p.credits.toLocaleString()} Credits
              </h3>
              {p.popular && <Tag color="blue">Popular</Tag>}
            </div>

            <p className="text-2xl font-bold mb-2">${p.price}</p>

            <p className="text-sm text-gray-500 mb-4">
              ${((p.price / p.credits) * 100).toFixed(1)}¢ per credit
            </p>

            <Button
              type={p.popular ? "primary" : "default"}
              icon={<Zap />}
              block
              onClick={() => purchase(p.credits)}
            >
              Purchase
            </Button>
          </Card>
        ))}
      </div>

      {/* Custom */}
      <Card
        title={
          <span className="flex items-center gap-2">
            <CreditCard /> Custom Amount
          </span>
        }
        className="max-w-md"
        style={{
          marginInline: "auto",
        }}
      >
        <Form form={form} onFinish={() => swal.success("Credits purchased!")}>
          <Form.Item label="Number of Credits" name="credits">
            <InputNumber className="w-full" min={1} />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Purchase Custom
          </Button>
        </Form>
      </Card>
    </div>
  );
}
