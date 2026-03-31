"use client";

import { useState } from "react";
import { Card, Tabs, Input, Button, Flex, Space, message } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

import PageHeader from "@/components/shared/page-header";
import { superAdminBreadcrumb } from "@/config/breadcrumb.config";

import { mockPackages } from "./data";
import useModuleMatrix from "./_hooks/use-module-matrix";
import PackageListTable from "./_components/package-list-table";
import ModuleMatrixTable from "./_components/module-matrix-table";
import LimitSettingsTable from "./_components/limit-settings-table";

export default function PackagesPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("list");

  const { matrix, toggle } = useModuleMatrix(mockPackages);

  const filtered = mockPackages.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const tabs = [
    {
      key: "list",
      label: "Package List",
      children: (
        <Card>
          <Flex justify="space-between" wrap="wrap">
            <Space>
              <Input
                prefix={<SearchOutlined />}
                placeholder="Search packages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Space>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() =>
                router.push("/super-admin/dashboard/packages/create")
              }
            >
              Create Package
            </Button>
          </Flex>

          <PackageListTable
            data={filtered}
            onDelete={() => {
              message.warning(`Deleted package!`);
            }}
          />
        </Card>
      ),
    },
    {
      key: "matrix",
      label: "Module Matrix",
      children: (
        <Card>
          <ModuleMatrixTable
            packages={mockPackages}
            matrix={matrix}
            onToggle={toggle}
          />
        </Card>
      ),
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
