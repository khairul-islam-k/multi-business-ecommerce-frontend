"use client";

import {
  Pencil
} from "lucide-react";


import Link from "next/link";
import { Button, Card, Table } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import ChargeCard from "./_components/ChargeCard";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const courierRates = [
  {
    id: 1,
    Courier: "TCS Express",
    Zone: "Karachi Metro",
    "Inside City": "Rs 150",
    "Sub City": "Rs 200",
    "Outside City": "Rs 300",
    "COD Charge": "Rs 30",
  },
  {
    id: 2,
    Courier: "TCS Express",
    Zone: "Lahore Metro",
    "Inside City": "Rs 140",
    "Sub City": "Rs 190",
    "Outside City": "Rs 280",
    "COD Charge": "Rs 30",
  },
  {
    id: 3,
    Courier: "Leopards Courier",
    Zone: "Karachi Metro",
    "Inside City": "Rs 145",
    "Sub City": "Rs 195",
    "Outside City": "Rs 290",
    "COD Charge": "Rs 25",
  },
  {
    id: 4,
    Courier: "Leopards Courier",
    Zone: "Punjab Zone",
    "Inside City": "Rs 160",
    "Sub City": "Rs 210",
    "Outside City": "Rs 320",
    "COD Charge": "Rs 35",
  },
  {
    id: 5,
    Courier: "DHL Express",
    Zone: "International Zone A",
    "Inside City": "Rs 500",
    "Sub City": "Rs 650",
    "Outside City": "Rs 900",
    "COD Charge": "Rs 0",
  },
];

const data = [
  {
    zone: "TCS - Karachi",
    inside: 150,
    sub: 200,
    outside: 300,
  },
  {
    zone: "TCS - Lahore",
    inside: 160,
    sub: 220,
    outside: 320,
  },
  {
    zone: "TCS - Islamabad/Rawalpindi",
    inside: 170,
    sub: 230,
    outside: 350,
  },
  {
    zone: "Leopards - Punjab",
    inside: 140,
    sub: 190,
    outside: 280,
  },
  {
    zone: "Leopards - Sindh",
    inside: 150,
    sub: 200,
    outside: 300,
  },
  {
    zone: "PostEx - All",
    inside: 120,
    sub: 180,
    outside: 250,
  },
];

const ChargeSetting = () => {
  const columns = [
    {
      title: "Courier",
      dataIndex: "Courier",
      key: "courier",
    },
    {
      title: "Zone",
      dataIndex: "Zone",
      key: "zone",
    },
    {
      title: "Inside City",
      dataIndex: "Inside City",
      key: "insideCity",
    },
    {
      title: "Sub City",
      dataIndex: "Sub City",
      key: "subCity",
    },
    {
      title: "Outside City",
      dataIndex: "Outside City",
      key: "outsideCity",
    },
    {
      title: "COD Charge",
      dataIndex: "COD Charge",
      key: "codCharge",
    },
    {
      title: "",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (record: any) => (
        <Link
          href={`/admin/dashboard/couriers/charge-setting/charge-update/${record.id}`}
        >
          <Button icon={<Pencil />} type="text"></Button>
        </Link>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <PageHeader
          title="Shipping Charge Settings"
          breadcrumb={adminBreadcrumb}
        ></PageHeader>
      </div>

      {/* card */}
      <ChargeCard />

      <Card title="Charges Comparison">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} barGap={8}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="zone" />
            <YAxis />
            <Tooltip formatter={(value) => `Rs ${value}`} />
            <Legend />

            <Bar dataKey="inside" name="Inside City" fill="var(--dashboard-primary-color)" />
            <Bar dataKey="sub" name="Sub City" fill="var(--dashboard-info-color)" />
            <Bar dataKey="outside" name="Outside City" fill="var(--dashboard-error-color)" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Table */}
      <Table
        rowKey="id"
        columns={columns}
        dataSource={courierRates}
        bordered
        pagination={false}
      />
    </div>
  );
};

export default ChargeSetting;
