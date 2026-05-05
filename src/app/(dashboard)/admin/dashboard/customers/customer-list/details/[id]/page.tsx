"use client";

import { useParams } from "next/navigation";

import Address from "../_components/Address";
import DetailsCard from "../_components/DetailsCard";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import RecentOrderTable from "../_components/RecentOrderTable";

export type Customer = {
  id: number;
  customer: string;
  contact: string;
  email: string;
  city: string;
  source: string;
  orders: number;
  spent: string;
  status: "Active" | "Inactive";
};

const CustomerDetails = () => {
  const { id } = useParams();
  console.log(id);

  const userData: Customer = {
    id: 1,
    customer: "Ahmed Khan",
    contact: "+92-300-1234567",
    email: "ahmed@example.com",
    city: "Islamabad",
    source: "Website",
    orders: 45,
    spent: "Rs 125,000",
    status: "Inactive",
  };

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <PageHeader
          title="Ahmed Khan"
          breadcrumb={adminBreadcrumb}
        ></PageHeader>
      </div>
      <p>Customer since 1/15/2025</p>

      <DetailsCard userData={userData} />

      {/* Address */}
      <Address userData={userData} />

      {/* Table */}
      <RecentOrderTable />
    </div>
  );
};

export default CustomerDetails;
