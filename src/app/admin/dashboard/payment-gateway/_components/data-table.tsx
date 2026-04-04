"use client";

import { Table } from "antd";

export default function DataTable({ data, columns }: any) {
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
        ? (_: any, record: any) => col.accessor(record)
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
