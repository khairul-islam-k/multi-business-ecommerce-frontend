"use client";

import { Badge } from "antd";

export default function StatusBadge({
  status,
  text,
}: {
  status: string;
  text: string;
}) {
  const map: Record<string, any> = {
    paid: "success",
    unpaid: "default",
  };

  return <Badge status={map[status] || "default"} text={text} />;
}
