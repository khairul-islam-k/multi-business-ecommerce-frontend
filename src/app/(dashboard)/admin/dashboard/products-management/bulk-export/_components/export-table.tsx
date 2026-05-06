import { Button, Card, Tooltip } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { DownloadOutlined } from "@ant-design/icons";

// data/exportHistory.ts
interface ExportHistoryItem {
  key: string;
  fileName: string;
  format: string;
  records: string;
  size: string;
  exportedBy: string;
  date: string;
}

const exportHistory: ExportHistoryItem[] = [
  {
    key: "1",
    fileName: "products_full_export.csv",
    format: "CSV",
    records: "856",
    size: "2.4 MB",
    exportedBy: "John Doe",
    date: "Mar 31, 2026",
  },
  {
    key: "2",
    fileName: "inventory_export_march_2026.xlsx",
    format: "XLSX",
    records: "1,240",
    size: "4.1 MB",
    exportedBy: "Jane Smith",
    date: "Mar 28, 2026",
  },
  {
    key: "3",
    fileName: "orders_export_q1_2026.csv",
    format: "CSV",
    records: "3,560",
    size: "6.8 MB",
    exportedBy: "Michael Brown",
    date: "Mar 20, 2026",
  },
];

const ExportTable = () => {
  const handleDownload = (record: ExportHistoryItem) => {
    console.log("Downloading:", record.fileName);
    // call API or download logic here
  };

  const columns: ColumnsType<ExportHistoryItem> = [
    {
      title: "File Name",
      dataIndex: "fileName",
      key: "fileName",
    },
    {
      title: "Format",
      dataIndex: "format",
      key: "format",
      align: "center",
    },
    {
      title: "Records",
      dataIndex: "records",
      key: "records",
      align: "center",
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
      align: "center",
    },
    {
      title: "Exported By",
      dataIndex: "exportedBy",
      key: "exportedBy",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_: string, record: ExportHistoryItem) => (
        <Tooltip title="Download">
          <Button
            type="text"
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(record)}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div style={{ marginTop: "15px" }}>
      <Card>
        <h3 style={{ fontSize: "20px", fontWeight: "bold", margin: 0 }}>
          Export History
        </h3>
        <p>Previously generated exports</p>

        <div
          style={{
            overflowX: "auto",
            overflowY: "hidden",
          }}
        >
          <Table
            columns={columns}
            dataSource={exportHistory}
            pagination={false}
            bordered
          />
        </div>
      </Card>
    </div>
  );
};

export default ExportTable;
