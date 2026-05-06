"use client";

import { Tag, theme } from "antd";
import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import TableWrapper from "./table-wrapper";

export default function BillingTable({ tenantId }: { tenantId: string }) {
  const { token } = theme.useToken();

  const { data, isLoading } = useQuery({
    queryKey: ["tenant-billing", tenantId],
    queryFn: async () =>
      api.get(`/auth-tenant/${tenantId}/billing`).then((res) => res.data),
  });

  const billing = data?.data || [];

  const columns = [
    { title: "Invoice", dataIndex: "id" },
    { title: "Amount", dataIndex: "amount" },
    { title: "Tax", dataIndex: "tax" },
    { title: "Total", dataIndex: "total" },
    {
      title: "Status",
      dataIndex: "status",
      render: (s: string) => (
        <Tag
          style={{
            background: s === "Paid" ? token.colorSuccess : token.colorError,
            color: token.colorWhite,
          }}
        >
          {s}
        </Tag>
      ),
    },
    { title: "Paid Date", dataIndex: "paidDate" },
  ];

  return <TableWrapper data={billing} columns={columns} loading={isLoading} />;
}
