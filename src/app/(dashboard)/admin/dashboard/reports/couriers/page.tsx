"use client";

import {
  Banknote,
  CircleCheck,
  Clock,
  Truck
} from "lucide-react";



import ReportPage from "../_components/report-page";

export default function CourierReports() {
  return (
    <ReportPage
      title="Courier Reports"
      description="Track courier performance, delivery times, and shipping costs"
      stats={[
        {
          label: "Active Couriers",
          value: "5",
          change: "Partners",
          up: true,
          icon: Truck,
        },
        {
          label: "Avg Delivery Time",
          value: "3.8 days",
          change: "-0.5 days",
          up: false,
          icon: Clock,
        },
        {
          label: "Delivery Success",
          value: "96.2%",
          change: "+0.8%",
          up: true,
          icon: CircleCheck,
        },
        {
          label: "Shipping Cost",
          value: "₹2,40,000",
          change: "-3%",
          up: false,
          icon: Banknote,
        },
      ]}
      chartData={[
        "Delhivery",
        "BlueDart",
        "DTDC",
        "Ecom Express",
        "Xpressbees",
      ].map((c, i) => ({ name: c, value: [580, 420, 310, 280, 260][i] }))}
      tableHeaders={[
        "Courier",
        "Shipments",
        "Avg Time",
        "Success %",
        "RTO %",
        "Cost/Shipment",
      ]}
      tableRows={[
        ["Delhivery", "580", "3.2 days", "97%", "4.2%", "₹85"],
        ["BlueDart", "420", "2.8 days", "98%", "3.1%", "₹120"],
        ["DTDC", "310", "4.5 days", "94%", "6.8%", "₹70"],
        ["Ecom Express", "280", "3.9 days", "96%", "5.1%", "₹78"],
        ["Xpressbees", "260", "4.1 days", "95%", "5.5%", "₹65"],
      ]}
    />
  );
}
