"use client";

import { useState } from "react";
import { Card, Tabs } from "antd";
import { useRouter } from "next/navigation";

import PageHeader from "@/components/shared/page-header";
import { superAdminBreadcrumb } from "@/config/breadcrumb.config";

import { mockPackages } from "./data";
import PackageListTable from "./_components/package-list-table";
import ModuleMatrixTable from "./_components/module-matrix-table";
import LimitSettingsTable from "./_components/limit-settings-table";

export default function PackagesPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("list");

  const filtered = mockPackages.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const tabs = [
    {
      key: "list",
      label: "Package List",
      children: <PackageListTable />,
    },
    {
      key: "matrix",
      label: "Module Matrix",
      children: <ModuleMatrixTable />,
    },
    {
      key: "limits",
      label: "Limit Settings",
      children: (
        <Card>
          <LimitSettingsTable packages={mockPackages} />
        </Card>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Package" breadcrumb={superAdminBreadcrumb} />
      <Tabs items={tabs} activeKey={activeTab} onChange={setActiveTab} />
    </div>
  );
}
