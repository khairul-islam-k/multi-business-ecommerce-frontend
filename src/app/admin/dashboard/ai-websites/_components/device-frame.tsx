"use client";

import { Card } from "antd";
import type { PreviewDevice } from "../types";

const widths: Record<PreviewDevice, number> = {
  desktop: 1000,
  tablet: 768,
  mobile: 375,
};

export function DeviceFrame({
  device,
  children,
}: {
  device: PreviewDevice;
  children: React.ReactNode;
}) {
  return (
    <div style={{ maxWidth: widths[device], margin: "0 auto" }}>
      <Card bodyStyle={{ padding: 0 }}>
        <div style={{ padding: 8, borderBottom: "1px solid #eee" }}>
          acme-corp.example.com
        </div>
        <div style={{ maxHeight: "70vh", overflowY: "auto" }}>{children}</div>
      </Card>
    </div>
  );
}
