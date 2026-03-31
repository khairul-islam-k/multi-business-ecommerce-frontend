"use client";

import { Card, Table, Tabs, Typography, Empty } from "antd";

import { formatCurrency } from "./utils";
import PageHeader from "@/components/shared/page-header";
import { mockInventories, mockWarehouses } from "./data";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const { TabPane } = Tabs;
const { Text } = Typography;

export default function WarehouseStock() {
  return (
    <>
      <PageHeader title="Warehouse Stock View" breadcrumb={adminBreadcrumb} />

      <Tabs defaultActiveKey={mockWarehouses[0].id}>
        {mockWarehouses.map((w) => {
          const items = mockInventories.filter((i) => i.warehouse_id === w.id);

          const columns = [
            {
              title: "Product",
              dataIndex: "product",
              key: "product",
              render: (_: any, record: any) => <Text>{record.name}</Text>,
            },
            {
              title: "Available",
              dataIndex: "available",
              key: "available",
              align: "right" as const,
            },
            {
              title: "Reserved",
              dataIndex: "reserved",
              key: "reserved",
              align: "right" as const,
            },
            {
              title: "Damaged",
              dataIndex: "damaged",
              key: "damaged",
              align: "right" as const,
            },
            {
              title: "Total Value",
              dataIndex: "totalValue",
              key: "totalValue",
              align: "right" as const,
            },
          ];

          const dataSource = items.map((inv) => {
            return {
              key: inv.id,
              name: inv.product_name,
              available: inv.available_qty,
              reserved: inv.reserved_qty,
              damaged: inv.damaged_qty,
              totalValue: formatCurrency(inv.available_qty * inv.avg_cost),
            };
          });

          return (
            <TabPane tab={w.name} key={w.id}>
              <Card title={`${w.name} — ${w.location}`}>
                {dataSource.length > 0 ? (
                  <Table
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                    scroll={{ x: "max-content" }}
                  />
                ) : (
                  <Empty description="No stock in this warehouse" />
                )}
              </Card>
            </TabPane>
          );
        })}
      </Tabs>
    </>
  );
}
