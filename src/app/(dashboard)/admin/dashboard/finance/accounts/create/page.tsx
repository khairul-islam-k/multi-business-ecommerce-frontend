"use client";

import Link from "next/link";
import {
  Button,
  Card,
  Col,
  Divider,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
} from "antd";

import useSubmit from "@/hooks/use-submit";
import { useSwal } from "@/hooks/use-swal";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

export default function CreateAccountPage() {
  const swal = useSwal();

  const { loading, handler } = useSubmit(async () => {
    await Promise.resolve(setTimeout(() => {}, 1000));
    swal.success("Copied");
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Create Account" breadcrumb={adminBreadcrumb} />

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Space orientation="vertical" size={16} style={{ width: "100%" }}>
            <Card title="Account Information">
              <Row gutter={16} className="mb-4">
                <Col span={12}>
                  <Input placeholder="Account Name" />
                </Col>
                <Col span={12}>
                  <Select defaultValue="Account Type" style={{ width: "100%" }}>
                    {["Bank", "Cash", "Revenue", "Expense"].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </Select>
                </Col>
              </Row>

              <Row gutter={16} className="mb-4">
                <Col span={12}>
                  <InputNumber
                    placeholder="Account Number"
                    style={{ width: "100%" }}
                  />
                </Col>
                <Col span={12}>
                  <InputNumber
                    placeholder="Initial Balance"
                    style={{ width: "100%" }}
                  />
                </Col>
              </Row>

              <Row gutter={16} className="mb-4">
                <Col span={12}>
                  <Select defaultValue="Status" style={{ width: "100%" }}>
                    {["Active", "Inactive"].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </Select>
                </Col>
              </Row>

              <Divider />

              <div className="flex gap-4">
                <Button type="primary" onClick={handler} loading={loading}>
                  Create Account
                </Button>

                <Link href="/admin/dashboard/finance/accounts">
                  <Button type="default">Cancel</Button>
                </Link>
              </div>
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
}
