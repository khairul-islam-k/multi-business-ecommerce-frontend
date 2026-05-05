"use client";

import { Tag } from "antd";
import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import TableWrapper from "./table-wrapper";

export default function LogsTable({ tenantId }: { tenantId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["tenant-logs", tenantId],
    queryFn: async () =>
      api.get(`/auth-tenant/${tenantId}/logs`).then((res) => res.data),
  });

  const logs = data?.data || [];

  const columns = [
    {
      title: "Level",
      dataIndex: "level",
      render: (l: string) => (
        <Tag
          color={l === "error" ? "red" : l === "warning" ? "orange" : "blue"}
        >
          {l}
        </Tag>
      ),
    },
    { title: "Service", dataIndex: "service" },
    { title: "Message", dataIndex: "message" },
    { title: "Time", dataIndex: "timestamp" },
  ];

  return <TableWrapper data={logs} columns={columns} loading={isLoading} />;
}
