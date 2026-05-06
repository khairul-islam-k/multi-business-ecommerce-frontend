import { Card, Tag } from "antd";
import Table, { ColumnsType } from "antd/es/table";

interface ImportHistoryItem {
  key: string;
  fileName: string;
  total: number;
  success: number;
  failed: number;
  status: "completed" | "failed" | "processing";
  importedBy: string;
  date: string;
}

const importHistory: ImportHistoryItem[] = [
  {
    key: "1",
    fileName: "products_march_2026.csv",
    total: 150,
    success: 148,
    failed: 2,
    status: "completed",
    importedBy: "John Doe",
    date: "Mar 30, 2026",
  },
  {
    key: "2",
    fileName: "products_february_2026.csv",
    total: 200,
    success: 195,
    failed: 5,
    status: "completed",
    importedBy: "Jane Smith",
    date: "Feb 28, 2026",
  },
  {
    key: "3",
    fileName: "inventory_january_2026.csv",
    total: 120,
    success: 118,
    failed: 2,
    status: "completed",
    importedBy: "Michael Brown",
    date: "Jan 15, 2026",
  },
  {
    key: "4",
    fileName: "products_april_2026.csv",
    total: 180,
    success: 170,
    failed: 10,
    status: "failed",
    importedBy: "Emily Clark",
    date: "Apr 02, 2026",
  },
];

const ImportTable = () => {
  const columns: ColumnsType<ImportHistoryItem> = [
    {
      title: "File Name",
      dataIndex: "fileName",
      key: "fileName",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      align: "center",
    },
    {
      title: "Success",
      dataIndex: "success",
      key: "success",
      align: "center",
    },
    {
      title: "Failed",
      dataIndex: "failed",
      key: "failed",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status: string) => {
        const color =
          status === "completed"
            ? "green"
            : status === "failed"
              ? "red"
              : "orange";

        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Imported By",
      dataIndex: "importedBy",
      key: "importedBy",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
  ];

  return (
    <div style={{ marginTop: "10px" }}>
      <Card>
        <h3 style={{ fontSize: "18px", fontWeight: "bold", margin: 0 }}>
          Import History
        </h3>
        <p>Past import operations and their results</p>

        <div
          style={{
            overflowX: "auto",
            overflowY: "hidden",
          }}
        >
          <Table
            columns={columns}
            dataSource={importHistory}
            pagination={false}
            bordered
          />
        </div>
      </Card>
    </div>
  );
};

export default ImportTable;
