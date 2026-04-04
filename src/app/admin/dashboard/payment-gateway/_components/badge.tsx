"use client";

import { Badge } from "antd";

export default function StatusBadge({ status }: { status: string }) {
  const map: Record<string, any> = {
    active: "success",
    inactive: "default",
    pending: "processing",
  };

  return <Badge status={map[status] || "default"} text={status} />;
}
