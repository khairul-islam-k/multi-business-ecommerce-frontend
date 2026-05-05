"use client";

import { Table } from "antd";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DataTable({ data, columns }: any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mappedColumns = columns.map((col: any) => ({
    title: col.header,
    dataIndex: col.dataIndex,
    key: col.header,
    align: col.className?.includes("text-right")
      ? "right"
      : col.className?.includes("text-center")
        ? "center"
        : "left",
    render:
      typeof col.accessor === "function"
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (_: any, record: any) => col.accessor(record)
        : undefined,
  }));

  return (
    <Table
      rowKey="id"
      dataSource={data}
      columns={mappedColumns}
      pagination={false}
    />
  );
}
