import Link from "next/link";
import { Button, Table, Tag } from "antd";
import { EyeOutlined } from "@ant-design/icons";

const CustomersTable = () => {
  const customers = [
    {
      id: 1,
      customer: "Ahmed Khan",
      contact: "+92-300-1234567",
      email: "ahmed@example.com",
      city: "Islamabad",
      source: "Website",
      orders: 45,
      spent: "Rs 125,000",
      status: "Inactive",
    },
    {
      id: 2,
      customer: "Sara Ali",
      contact: "+92-321-9876543",
      email: "sara.ali@gmail.com",
      city: "Lahore",
      source: "Facebook",
      orders: 12,
      spent: "Rs 38,500",
      status: "Active",
    },
    {
      id: 3,
      customer: "Usman Raza",
      contact: "+92-333-4567890",
      email: "usman.raza@yahoo.com",
      city: "Karachi",
      source: "Referral",
      orders: 27,
      spent: "Rs 82,000",
      status: "Active",
    },
    {
      id: 4,
      customer: "Fatima Noor",
      contact: "+92-312-6543210",
      email: "fatima.noor@example.com",
      city: "Rawalpindi",
      source: "Instagram",
      orders: 5,
      spent: "Rs 14,200",
      status: "Inactive",
    },
  ];

  const columns = [
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Contact",
      dataIndex: "contact",
      key: "contact",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
    },
    {
      title: "Source",
      dataIndex: "source",
      key: "source",
    },
    {
      title: "Orders",
      dataIndex: "orders",
      key: "orders",
    },
    {
      title: "Spent",
      dataIndex: "spent",
      key: "spent",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "Active" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (record: any) => (
        <Link
          href={`/admin/dashboard/customers/customer-list/details/${record.id}`}
        >
          <Button type="text" icon={<EyeOutlined />} />
        </Link>
      ),
    },
  ];

  return (
    <div style={{ overflowX: "auto" }}>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={customers}
        pagination={{ pageSize: 5 }}
        bordered
      />
    </div>
  );
};

export default CustomersTable;
