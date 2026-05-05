"use client";

import { useParams } from "next/navigation";
import { Button, Card, Col, Input, Row, Space } from "antd";
import { SaveOutlined, EyeOutlined } from "@ant-design/icons";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const { TextArea } = Input;

export default function EditInvoiceTemplate() {
  const { templateId } = useParams();

  const mockConfig = {
    layout: "standard",
    colors: {
      primary: "#1677ff",
      text: "#1f2937",
    },
    header: { showLogo: true },
    footer: { showTerms: true },
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Invoice Template" breadcrumb={adminBreadcrumb} />

      <div className="flex justify-between items-center">
        <p className="text-gray-500">Editing template #{templateId}</p>

        <Space>
          <Button icon={<EyeOutlined />}>Preview</Button>
          <Button type="primary" icon={<SaveOutlined />}>
            Save Template
          </Button>
        </Space>
      </div>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="Template Info">
            <Space direction="vertical" style={{ width: "100%" }}>
              <Input
                placeholder="Template Name"
                defaultValue="Standard Invoice"
              />
              <Input placeholder="Slug" defaultValue="standard" />
            </Space>
          </Card>

          <Card title="Design JSON" className="mt-4">
            <TextArea
              rows={14}
              defaultValue={JSON.stringify(mockConfig, null, 2)}
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Live Preview">
            <div className="border p-6 min-h-100 bg-gray-50">
              <div className="flex justify-between mb-6">
                <div>
                  <div className="h-6 w-20 bg-gray-300 mb-2" />
                  <b>INVOICE</b>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>INV-001</p>
                  <p>Feb 10, 2024</p>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="h-3 w-3/4 bg-gray-300" />
                <div className="h-3 w-1/2 bg-gray-300" />
              </div>

              <div className="border-t pt-4 space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-3 w-1/2 bg-gray-300" />
                    <div className="h-3 w-16 bg-gray-300" />
                  </div>
                ))}
              </div>

              <div className="border-t mt-4 pt-4 flex justify-end">
                <div className="h-4 w-24 bg-blue-300" />
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
