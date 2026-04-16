"use client";

import { Table, theme } from "antd";

export default function TableWrapper({
  data = [],
  columns = [],
  rowKey = "id",
  loading = false,
}: any) {
  const { token } = theme.useToken();

  return (
    <div style={{ overflowX: "auto", background: token.colorBgBase }}>
      <Table
        dataSource={data}
        columns={columns}
        rowKey={rowKey}
        loading={loading}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
}
