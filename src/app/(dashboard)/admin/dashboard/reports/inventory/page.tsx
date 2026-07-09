"use client";

import {
  CircleCheck,
  CircleX,
  LayoutDashboard,
  TriangleAlert
} from "lucide-react";



import ReportPage from "../_components/report-page";

export default function InventoryReports() {
  return (
    <ReportPage
      title="Inventory Reports"
      description="Monitor stock levels, turnover rates, and dead stock analysis"
      // stats={[
      //   {
      //     label: "Total SKUs",
      //     value: "12,800",
      //     change: "+120 new",
      //     up: true,
      //     icon: LayoutDashboard,
      //   },
      //   {
      //     label: "In Stock",
      //     value: "10,450",
      //     change: "81.6%",
      //     up: true,
      //     icon: CircleCheck,
      //   },
      //   {
      //     label: "Low Stock",
      //     value: "1,850",
      //     change: "14.5%",
      //     up: false,
      //     icon: TriangleAlert,
      //   },
      //   {
      //     label: "Out of Stock",
      //     value: "500",
      //     change: "3.9%",
      //     up: false,
      //     icon: CircleX,
      //   },
      // ]}
      chartData={[
        "Electronics",
        "Clothing",
        "Home",
        "Sports",
        "Books",
        "Beauty",
      ].map((c, i) => ({
        name: c,
        value: [3200, 2800, 2400, 1800, 1500, 1100][i],
      }))}
      tableHeaders={[
        "Product",
        "SKU",
        "In Stock",
        "Reserved",
        "Reorder Level",
        "Status",
      ]}
      tableRows={[
        ["Premium T-Shirt", "TSH-001", "245", "30", "50", "OK"],
        ["Wireless Earbuds", "EAR-002", "12", "5", "25", "Low Stock"],
        ["Laptop Stand", "LST-003", "0", "0", "15", "Out of Stock"],
        ["Phone Case", "PHC-004", "890", "45", "100", "OK"],
        ["USB-C Hub", "USB-005", "18", "8", "20", "Low Stock"],
      ]}
    />
  );
}
