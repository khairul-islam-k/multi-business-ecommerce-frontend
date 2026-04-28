"use client";

import PageHeader from "@/components/shared/page-header";
import {
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Space,
  message,
  theme,
} from "antd";
import { useRouter, useParams } from "next/navigation";
import { mockPromotions } from "../data";
import dayjs from "dayjs";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useSwal } from "@/hooks/use-swal";

const { Option } = Select;

export default function PromotionForm({
  mode = "create",
}: {
  mode?: "create" | "edit";
}) {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { token } = theme.useToken();
  const swal = useSwal();

  const promo =
    mode === "edit" ? mockPromotions.find((p) => p.id === id) : null;

  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log(values);

    swal.success(
      mode === "create" ? "Promotion created!" : "Promotion updated!",
    );

    router.push("/admin/dashboard/promotions");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={mode === "create" ? "Create Promotion" : "Edit Promotion"}
        breadcrumb={adminBreadcrumb}
      />

      <div
        style={{
          padding: 24,
          background: token.colorBgBase,
        }}
      >
        <Card style={{ maxWidth: 700, marginInline: "auto" }}>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              name: promo?.name,
              promotion_type: promo?.promotion_type,
              discount_type: promo?.discount_type,
              discount_value: promo?.discount_value,
              start_at: promo?.start_at ? dayjs(promo.start_at) : null,
              end_at: promo?.end_at ? dayjs(promo.end_at) : null,
            }}
          >
            <Form.Item label="Name" name="name" rules={[{ required: true }]}>
              <Input placeholder="e.g. Summer Sale" />
            </Form.Item>

            <Space style={{ display: "flex" }} size={16}>
              <Form.Item
                label="Promotion Type"
                name="promotion_type"
                style={{ flex: 1 }}
                rules={[{ required: true }]}
              >
                <Select placeholder="Select type">
                  {["percentage", "fixed", "bogo", "free_shipping"].map((t) => (
                    <Option key={t} value={t}>
                      {t.replace("_", " ")}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Discount Type"
                name="discount_type"
                style={{ flex: 1 }}
                rules={[{ required: true }]}
              >
                <Select placeholder="Select type">
                  <Option value="percentage">Percentage</Option>
                  <Option value="fixed_amount">Fixed Amount</Option>
                </Select>
              </Form.Item>
            </Space>

            <Form.Item
              label="Discount Value"
              name="discount_value"
              rules={[{ required: true }]}
            >
              <Input type="number" placeholder="e.g. 20" />
            </Form.Item>

            <Space style={{ display: "flex" }} size={16}>
              <Form.Item
                label="Start Date"
                name="start_at"
                style={{ flex: 1 }}
                rules={[{ required: true }]}
              >
                <DatePicker showTime style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                label="End Date"
                name="end_at"
                style={{ flex: 1 }}
                rules={[{ required: true }]}
              >
                <DatePicker showTime style={{ width: "100%" }} />
              </Form.Item>
            </Space>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  {mode === "create" ? "Create" : "Update"} Promotion
                </Button>
                <Button
                  onClick={() => router.push("/admin/dashboard/promotions")}
                >
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}
