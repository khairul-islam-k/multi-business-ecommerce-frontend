import { Card, Table, Tag } from "antd";

const courierPerformance = [
  {
    id: 1,
    Courier: "TCS Express",
    "Total Shipments": "835",
    Delivered: "763",
    Returned: "45",
    "Success Rate": "91.4%",
    "Avg Days": 3.1,
    Rating: "Good",
  },
  {
    id: 2,
    Courier: "Leopards Courier",
    "Total Shipments": "692",
    Delivered: "618",
    Returned: "52",
    "Success Rate": "89.3%",
    "Avg Days": 3.6,
    Rating: "Average",
  },
  {
    id: 3,
    Courier: "PostEx",
    "Total Shipments": "540",
    Delivered: "492",
    Returned: "38",
    "Success Rate": "91.1%",
    "Avg Days": 2.9,
    Rating: "Good",
  },
];

const PerformanceTable = () => {
  const columns = [
    {
      title: "Courier",
      dataIndex: "Courier",
      key: "courier",
    },
    {
      title: "Total Shipments",
      dataIndex: "Total Shipments",
      key: "totalShipments",
    },
    {
      title: "Delivered",
      dataIndex: "Delivered",
      key: "delivered",
    },
    {
      title: "Returned",
      dataIndex: "Returned",
      key: "returned",
    },
    {
      title: "Success Rate",
      dataIndex: "Success Rate",
      key: "successRate",
    },
    {
      title: "Avg Days",
      dataIndex: "Avg Days",
      key: "avgDays",
    },
    {
      title: "Rating",
      dataIndex: "Rating",
      key: "rating",
      render: (rating: string) => {
        let color = "default";
        if (rating === "Good") color = "green";
        if (rating === "Average") color = "orange";
        return <Tag color={color}>{rating}</Tag>;
      },
    },
  ];

  return (
    <Card
      title="Performance Summary"
      style={{
        marginTop: "10px",
      }}
    >
      <div
        style={{
          overflowX: "auto",
          overflowY: "hidden",
        }}
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={courierPerformance}
          bordered
          pagination={false}
        />
      </div>
    </Card>
  );
};

export default PerformanceTable;
