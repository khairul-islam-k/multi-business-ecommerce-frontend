"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Result } from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  RocketOutlined,
} from "@ant-design/icons";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

export default function ApplyGeneratedWebsite() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleApply = () => {
    setLoading(true);
    setTimeout(() => {
      setDone(true);
      setLoading(false);
    }, 2000);
  };

  if (done) {
    return (
      <Result
        status="success"
        title="Website Applied!"
        icon={<CheckCircleOutlined />}
        extra={[
          <Button
            key="back"
            onClick={() => router.push("/admin/dashboard/ai-websites")}
          >
            Back
          </Button>,
          <Button
            key="view"
            type="primary"
            onClick={() =>
              router.push("/admin/dashboard/ai-websites/generated-preview")
            }
          >
            View
          </Button>,
        ]}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Apply Generation" breadcrumb={adminBreadcrumb} />

      <div style={{ padding: 24 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()} />

        <Card title="Apply Website" style={{ marginTop: 16 }}>
          <Button
            type="primary"
            icon={<RocketOutlined />}
            loading={loading}
            onClick={handleApply}
            block
          >
            Apply & Create Website
          </Button>
        </Card>
      </div>
    </div>
  );
}
