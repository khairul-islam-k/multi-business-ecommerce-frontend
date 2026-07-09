"use client";
import { useCustomerOverviewQuery } from "@/lib/api/hooks/customer-overview";
import React from "react";
import OverviewCard from "../_components/onverview/overview-card";

const FashionDashboard = () => {
  const { data: customers } = useCustomerOverviewQuery();
  const cards = customers?.cards ?? [];
  const charts = customers?.charts ?? [];

  console.log("charts", cards);

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 min-[360px]:grid-cols-2 md:grid-cols-3">
        {cards.map((stat) => (
          <OverviewCard key={stat.key} stat={stat} />
        ))}
      </div>
    </div>
  );
};

export default FashionDashboard;
