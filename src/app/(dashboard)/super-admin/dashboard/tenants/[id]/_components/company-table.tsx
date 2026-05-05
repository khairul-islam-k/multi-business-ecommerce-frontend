"use client";

import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import TableWrapper from "./table-wrapper";

export default function CompanyTable({ tenantId }: { tenantId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["tenant-companies", tenantId],
    queryFn: async () =>
      api.get(`/auth-tenant/${tenantId}/companies`).then((res) => res.data),
  });

  const companies = data?.data || [];

  const columns = [
    {
      title: "COMPANY",
      dataIndex: "name",
      render: (text: string) => <strong>{text}</strong>,
    },
    { title: "WEBSITES", dataIndex: "websites" },
    { title: "USERS", dataIndex: "users" },
  ];

  return (
    <TableWrapper data={companies} columns={columns} loading={isLoading} />
  );
}
