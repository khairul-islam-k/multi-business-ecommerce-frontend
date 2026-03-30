import { Tag, theme } from "antd";

import TableWrapper from "./table-wrapper";
import { mockBillingHistory } from "../data";

export default function BillingTable() {
  const { token } = theme.useToken();

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

  return (
    <TableWrapper data={mockBillingHistory} columns={columns} rowKey="id" />
  );
}
