"use client";

import SellingCart from "./_components/SellingCart";
import PageHeader from "@/components/shared/page-header";
import TopSellingTable from "./_components/TopSellingTable";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import SellingOverviewCard from "./_components/SellingOverviewCard";

const TopSelling = () => {
  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <PageHeader
          title="Top Selling Products"
          breadcrumb={adminBreadcrumb}
        ></PageHeader>
      </div>

      <SellingOverviewCard />

      <SellingCart />

      {/* Table */}
      <TopSellingTable />
    </div>
  );
};

export default TopSelling;
