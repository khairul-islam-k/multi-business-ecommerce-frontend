"use client";

import { useState } from "react";
import { Button, Segmented } from "antd";
import { useRouter } from "next/navigation";
import {
  ArrowLeftOutlined,
  DesktopOutlined,
  TabletOutlined,
  MobileOutlined,
  CheckOutlined,
} from "@ant-design/icons";

import { mockGeneratedResult } from "../data";
import { PageTabs } from "../_components/page-tabs";
import PageHeader from "@/components/shared/page-header";
import { DeviceFrame } from "../_components/device-frame";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { SectionPreview } from "../_components/section-preview";

export default function GeneratedLayoutPreview() {
  const router = useRouter();
  const { pages } = mockGeneratedResult;

  const [activeSlug, setActiveSlug] = useState(pages[0]?.slug);
  const [device, setDevice] = useState("desktop");

  const activePage = pages.find((p) => p.slug === activeSlug);

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Website Generation Preview"
        breadcrumb={adminBreadcrumb}
      />

      <div style={{ height: "100vh" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => router.push("/admin/dashboard/ai-websites")}
          />

          <Segmented
            value={device}
            onChange={(v) => setDevice(v as any)}
            options={[
              { value: "desktop", icon: <DesktopOutlined /> },
              { value: "tablet", icon: <TabletOutlined /> },
              { value: "mobile", icon: <MobileOutlined /> },
            ]}
          />

          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={() =>
              router.push("/admin/dashboard/ai-websites/apply-generated")
            }
          >
            Apply
          </Button>
        </div>

        <div style={{ padding: 16 }}>
          <PageTabs
            pages={pages}
            activeSlug={activeSlug}
            onSelect={setActiveSlug}
          />

          <DeviceFrame device={device as any}>
            {activePage?.sections.map((s) => (
              <SectionPreview key={s.section_key} section={s} />
            ))}
          </DeviceFrame>
        </div>
      </div>
    </div>
  );
}
