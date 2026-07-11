"use client";

import { Button, Card, Descriptions, Empty, Skeleton, Table, Tag } from "antd";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useStock } from "@/lib/api/hooks/stock";
import { useAuthStore } from "@/stores/auth.store";

const formatDate = (date?: string | null) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

const toNumber = (value?: string | number | null) => {
  return Number(value ?? 0);
};

const StockDetail = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const { data: stock, isLoading, isFetching } = useStock(businessId, id);

  const product = stock?.product;
  const variant = stock?.variant;

  const totalQuantity = toNumber(stock?.totalQuantity);
  const reservedQuantity = toNumber(stock?.quantityReserved);
  const availableQuantity = totalQuantity - reservedQuantity;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stock Details"
        subtitle="View product stock, warehouse quantity, and inventory information."
        breadcrumb={adminBreadcrumb}
      />

      <div className="flex justify-end">
        <Button icon={<ArrowLeft />} onClick={() => router.back()}>
          Back
        </Button>
      </div>

      {isLoading || isFetching ? (
        <Card>
          <Skeleton active paragraph={{ rows: 8 }} />
        </Card>
      ) : !stock ? (
        <Card>
          <Empty description="Stock not found" />
        </Card>
      ) : (
        <>
          <Card title="Stock Summary">
            <Descriptions bordered column={{ xs: 1, sm: 2, md: 3 }}>
              <Descriptions.Item label="Total Quantity">
                <strong>{totalQuantity}</strong>
              </Descriptions.Item>

              <Descriptions.Item label="Reserved Quantity">
                {reservedQuantity}
              </Descriptions.Item>

              <Descriptions.Item label="Available Quantity">
                <Tag color={availableQuantity > 0 ? "green" : "red"}>
                  {availableQuantity}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Low Stock Alert">
                {toNumber(stock.lowStockAlertQty)}
              </Descriptions.Item>

              <Descriptions.Item label="Created At">
                {formatDate(stock.createdAt)}
              </Descriptions.Item>

              <Descriptions.Item label="Updated At">
                {formatDate(stock.updatedAt)}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="Product Information">
            <Descriptions bordered column={{ xs: 1, sm: 2, md: 3 }}>
              <Descriptions.Item label="Product Name">
                <strong>{product?.name ?? "-"}</strong>
              </Descriptions.Item>

              <Descriptions.Item label="SKU">
                {product?.sku ?? "-"}
              </Descriptions.Item>

              <Descriptions.Item label="Barcode">
                {product?.barcode ?? "-"}
              </Descriptions.Item>

              <Descriptions.Item label="Price">
                {product?.price ? `৳${product.price}` : "-"}
              </Descriptions.Item>

              <Descriptions.Item label="Weight">
                {product?.weight ?? "-"}
              </Descriptions.Item>

              <Descriptions.Item label="Status">
                <Tag color={product?.status === "ACTIVE" ? "green" : "red"}>
                  {product?.status ?? "-"}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Description" span={3}>
                {product?.description || "-"}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="Variant Information">
            {variant ? (
              <Descriptions bordered column={{ xs: 1, sm: 2, md: 3 }}>
                <Descriptions.Item label="Variant Title">
                  <strong>{variant.title ?? "-"}</strong>
                </Descriptions.Item>

                <Descriptions.Item label="SKU">
                  {variant.sku ?? "-"}
                </Descriptions.Item>

                <Descriptions.Item label="Barcode">
                  {variant.barcode ?? "-"}
                </Descriptions.Item>

                <Descriptions.Item label="Price Override">
                  {variant.priceOverride ? `৳${variant.priceOverride}` : "-"}
                </Descriptions.Item>

                <Descriptions.Item label="Weight">
                  {variant.weight ?? "-"}
                </Descriptions.Item>

                <Descriptions.Item label="Status">
                  <Tag color={variant.status === "ACTIVE" ? "green" : "red"}>
                    {variant.status}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            ) : (
              <Empty description="This stock belongs to the base product. No variant is attached." />
            )}
          </Card>

          <Card title="Warehouse Stock">
            <Table
              rowKey={(row) => row.warehouse?.name ?? row.createdAt}
              dataSource={stock.warehouseStocks ?? []}
              pagination={false}
              scroll={{ x: true }}
              columns={[
                {
                  title: "Warehouse",
                  render: (_, row) => (
                    <div>
                      <strong>{row.warehouse?.name ?? "-"}</strong>
                      <div className="text-xs text-gray-500">
                        {row.warehouse?.address ?? "-"}
                      </div>
                    </div>
                  ),
                },
                {
                  title: "Phone",
                  render: (_, row) => row.warehouse?.phone ?? "-",
                },
                {
                  title: "Status",
                  render: (_, row) => (
                    <Tag
                      color={
                        row.warehouse?.status === "ACTIVE" ? "green" : "red"
                      }
                    >
                      {row.warehouse?.status ?? "-"}
                    </Tag>
                  ),
                },
                {
                  title: "Total Qty",
                  render: (_, row) => toNumber(row.totalQuantity),
                },
                {
                  title: "Reserved",
                  render: (_, row) => toNumber(row.quantityReserved),
                },
                {
                  title: "Available",
                  render: (_, row) =>
                    toNumber(row.totalQuantity) -
                    toNumber(row.quantityReserved),
                },
                {
                  title: "Updated At",
                  render: (_, row) => formatDate(row.updatedAt),
                },
              ]}
            />
          </Card>
        </>
      )}
    </div>
  );
};

export default StockDetail;
