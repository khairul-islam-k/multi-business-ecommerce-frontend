"use client";

import { Eye, Pencil } from "lucide-react";

import {
  App,
  Button,
  Card,
  Col,
  Form,
  InputNumber,
  Modal,
  Row,
  Select,
  Tag,
} from "antd";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { mockStats } from "./data";
import StatCard from "@/components/shared/stat-card";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useAuthStore } from "@/stores/auth.store";
import {
  useProductStockMutation,
  useProductStockQuery,
} from "@/lib/api/hooks/stock";
import { Column, DataTable } from "@/components/shared/data-table";
import { InventoryStockResponse } from "@/types/stock/stock";
import { getApiErrorMessage } from "@/lib/axios";

type LowStockAlertFormValues = {
  lowStockAlertQty: number;
};

type StockItem = InventoryStockResponse;

type StockTableRow = StockItem & {
  serial: number;
};

export default function StockOverviewPage() {
  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const router = useRouter();
  const { message } = App.useApp();

  // modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm<LowStockAlertFormValues>();
  const [stockId, setStockId] = useState<string>("");
  const [LowStock, setLowStock] = useState<string>("");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const limit = 10;

  const {
    data: stocks,
    isLoading,
    isFetching,
  } = useProductStockQuery(businessId, {
    page: currentPage,
    limit,
    search,
    status: statusFilter,
  });

  const { updateLowAlert } = useProductStockMutation(businessId);

  const total = stocks?.meta?.total || 0;
  const totalPages = Math.ceil(total / limit);

  // low alert
  const handleUpdateLowStockAlert = async (values: LowStockAlertFormValues) => {
    try {
      setIsSubmitting(true);

      const payload = {
        lowStockAlertQty: Number(values.lowStockAlertQty),
      };

      console.log("payload", payload, "id", stockId);
      const res = await updateLowAlert.mutateAsync({
        stockId,
        payload,
      });

      console.log("res", res);
      message.success("Low stock alert updated successfully");
      setIsModalOpen(false);
    } catch (error) {
      message.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const tableData: StockTableRow[] =
    stocks?.items?.map((item, index) => ({
      ...item,
      serial: (currentPage - 1) * limit + index + 1,
    })) ?? [];

  useEffect(() => {
    if (stocks) {
      form.setFieldsValue({
        lowStockAlertQty: Number(LowStock ?? 0),
      });
    }
  }, [stocks, form, LowStock]);

  const columns: Column<StockTableRow>[] = [
    {
      key: "serial",
      label: "SL",
      render: (row) => row.serial,
    },
    {
      key: "product",
      label: "Product",
      type: "primary",
      render: (row) => (
        <div>
          <strong>{row.product?.name ?? "-"}</strong>
        </div>
      ),
    },
    {
      key: "variant",
      label: "Variant",
      render: (row) => (
        <div>
          <span>{row.variant?.title ?? "-"}</span>
        </div>
      ),
    },
    {
      key: "warehouseStocks",
      label: "Warehouse",
      render: (row) =>
        row.warehouseStocks?.length ? (
          <div className="space-y-1">
            {row.warehouseStocks.map((item) => (
              <Tag key={item.id}>{item.warehouse?.name ?? "-"}</Tag>
            ))}
          </div>
        ) : (
          "-"
        ),
    },
    {
      key: "totalQuantity",
      label: "Total Qty",
      render: (row) => Number(row.totalQuantity ?? 0),
    },
    {
      key: "quantityReserved",
      label: "Reserved",
      render: (row) => Number(row.quantityReserved ?? 0),
    },
    {
      key: "availableQuantity",
      label: "Available",
      render: (row) => {
        const totalQuantity = Number(row.totalQuantity ?? 0);
        const reservedQuantity = Number(row.quantityReserved ?? 0);

        return totalQuantity - reservedQuantity;
      },
    },
    {
      key: "lowStockAlertQty",
      label: "Low Stock",
      render: (row) => Number(row.lowStockAlertQty ?? 0),
    },
    {
      key: "status",
      label: "Status",
      type: "meta",
      render: (row) => (
        <Tag color={row.product?.status === "ACTIVE" ? "green" : "red"}>
          {row.product?.status ?? "-"}
        </Tag>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button
            size="small"
            icon={<Eye />}
            onClick={() =>
              router.push(
                `/admin/dashboard/inventory/stock-overview/details/${row.id}`,
              )
            }
          />

          <Button
            size="small"
            icon={<Pencil />}
            onClick={() => {
              setIsModalOpen(true);
              setStockId(row.id);
              setLowStock(row.lowStockAlertQty);
            }}
          >
            Low stock
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Stock Overview" breadcrumb={adminBreadcrumb} />

      <Row gutter={[16, 16]}>
        {mockStats.map((stat) => (
          <Col xs={24} sm={12} lg={6} key={stat.label}>
            <StatCard stat={stat} />
          </Col>
        ))}
      </Row>

      <Card>
        <DataTable
          data={tableData}
          toolbarEnd={
            <div className="flex flex-col gap-3 md:flex-row">
              <Select
                placeholder="Filter by status"
                allowClear
                style={{ width: 180 }}
                onChange={(value) => {
                  setCurrentPage(1);
                  setStatusFilter(value ?? "");
                }}
                options={[
                  { label: "Active", value: "ACTIVE" },
                  { label: "Inactive", value: "INACTIVE" },
                ]}
              />
            </div>
          }
          columns={columns}
          onSearch={(value) => {
            setCurrentPage(1);
            setSearch(value);
          }}
          loading={isLoading || isFetching}
          pagination={{
            currentPage,
            onPageChange: setCurrentPage,
            totalPages,
          }}
        />
      </Card>

      {/* modal */}
      <Modal
        title="Update Low Stock Alert"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnHidden
      >
        <Form<LowStockAlertFormValues>
          form={form}
          layout="vertical"
          onFinish={handleUpdateLowStockAlert}
        >
          <Form.Item
            label="Low Stock Alert Quantity"
            name="lowStockAlertQty"
            rules={[
              {
                required: true,
                message: "Low stock alert quantity is required",
              },
            ]}
          >
            <InputNumber
              min={0}
              className="w-full"
              placeholder="Enter low stock alert quantity"
            />
          </Form.Item>

          <div className="flex justify-end gap-2">
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>

            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              Update
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
