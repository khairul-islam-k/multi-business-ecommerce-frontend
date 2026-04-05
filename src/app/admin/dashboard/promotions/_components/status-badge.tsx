"use client";

import { Tag } from "antd";

const statusColors: Record<string, string> = {
  active: "success",
  completed: "success",
  sent: "success",
  delivered: "success",

  draft: "default",
  inactive: "default",
  expired: "default",

  pending: "warning",

  scheduled: "processing",
  running: "processing",

  failed: "error",

  credit: "success",
  debit: "error",
};

export default function StatusBadge({ status }: { status: string }) {
  const key = status?.toLowerCase();
  const color = statusColors[key] ?? "default";

  return (
    <Tag color={color} style={{ textTransform: "capitalize" }}>
      {status}
    </Tag>
  );
}
