import { Tag } from "antd";

import TableWrapper from "./table-wrapper";
import { mockSystemLogs } from "../data";

export default function LogsTable() {
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

  return (
    <TableWrapper
      data={mockSystemLogs.slice(0, 5)}
      columns={columns}
      rowKey="id"
    />
  );
}
