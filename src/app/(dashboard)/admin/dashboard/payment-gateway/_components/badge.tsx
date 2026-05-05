"use client";

import { Badge } from "antd";

export default function StatusBadge({
  status,
  text,
}: {
  status: string;
  text: string;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const map: Record<string, any> = {
    active: "success",
    inactive: "default",
    pending: "processing",
  };

  return <Badge status={map[status] || "default"} text={text} />;
}
