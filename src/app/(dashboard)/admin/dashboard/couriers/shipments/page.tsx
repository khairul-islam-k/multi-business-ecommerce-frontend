"use client";

import { Button, Card, Dropdown, MenuProps, Select, Tag } from "antd";
import { Eye, MapPinned, MoreHorizontal, PackageCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Column, DataTable } from "@/components/shared/data-table";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useSwal } from "@/hooks/use-swal";
import {
  useCourierMutation,
  useCourierQuery,
  useShipmentQuery,
} from "@/lib/api/hooks/courier";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
// import type { ShipmentDetailsResponse } from "@/types/courier/shipment";
import { ShipmentResponse, ShipmentStatus } from "@/types/courier/courier";

const shipmentStatusOptions: { label: string; value: ShipmentStatus }[] = [
  { label: "Pending", value: "PENDING" },
  { label: "Booked", value: "BOOKED" },
  { label: "Picked Up", value: "PICKED_UP" },
  { label: "In Transit", value: "IN_TRANSIT" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Failed", value: "FAILED" },
  { label: "Returned", value: "RETURNED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const getShipmentStatusColor = (status: ShipmentStatus) => {
  const colors: Record<ShipmentStatus, string> = {
    PENDING: "orange",
    BOOKED: "blue",
    PICKED_UP: "cyan",
    IN_TRANSIT: "processing",
    DELIVERED: "green",
    FAILED: "red",
    RETURNED: "purple",
    CANCELLED: "default",
  };

  return colors[status] ?? "default";
};

const formatDate = (date?: string | null) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-BD", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

const ShipmentPage = () => {
  const router = useRouter();
  const swal = useSwal();

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    ShipmentStatus | undefined
  >();
  const [courierId, setCourierId] = useState("");

  const limit = 10;

  const {
    data: shipments,
    isLoading,
    isFetching,
  } = useShipmentQuery(businessId, {
    page: currentPage,
    limit,
    search,
    status: statusFilter,
    courierId: courierId || undefined,
  });

  const total = shipments?.meta?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const { data: courier } = useCourierQuery(businessId);
  const { shipmentBook } = useCourierMutation(businessId);

  const courierOptions = useMemo(() => {
    return (
      courier?.items?.map((item) => ({
        label: item.courier?.name ?? "Unknown Courier",
        value: item.courierId,
      })) ?? []
    );
  }, [courier?.items]);

  const handleBook = async (id: string) => {
    try {
      await shipmentBook.mutateAsync(id);
      swal.success("Shipment booked successfully");
    } catch (error) {
      swal.error(getApiErrorMessage(error));
    }
  };

  const columns: Column<ShipmentResponse>[] = [
    {
      key: "shipmentNo",
      label: "Shipment No",
      type: "primary",
      render: (row) => <strong>{row.shipmentNo}</strong>,
    },
    {
      key: "order",
      label: "Order",
      render: (row) => (
        <div className="space-y-1">
          <p className="m-0 font-medium">{row.order?.orderNo ?? "-"}</p>
        </div>
      ),
    },
    {
      key: "courier",
      label: "Courier",
      render: (row) => (
        <div className="space-y-1">
          <p className="m-0 font-medium">{row.courier?.name ?? "-"}</p>
        </div>
      ),
    },
    {
      key: "recipientName",
      label: "Recipient",
      render: (row) => (
        <div className="space-y-1">
          <p className="m-0 font-medium">{row.recipientName}</p>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      type: "meta",
      render: (row) => (
        <Tag color={getShipmentStatusColor(row.status as ShipmentStatus)}>
          {row.status}
        </Tag>
      ),
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (row) => formatDate(row.createdAt),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => {
        const items: MenuProps["items"] = [
          {
            key: "view",
            label: "View",
            icon: <Eye size={15} />,
            onClick: () =>
              router.push(`/admin/dashboard/couriers/shipments/view/${row.id}`),
          },

          row.consignmentId
            ? {
                key: "track",
                label: "Track",
                icon: <MapPinned size={15} />,
                onClick: () =>
                  router.push(
                    `/admin/dashboard/couriers/shipments/tracking/${row.id}`,
                  ),
              }
            : null,

          {
            key: "book",
            label: row.status === "BOOKED" ? "Rebook" : "Book",
            icon: <PackageCheck size={15} />,
            onClick: () => handleBook(row.id),
          },
        ].filter(Boolean) as MenuProps["items"];

        return (
          <Dropdown
            menu={{ items }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button size="small" icon={<MoreHorizontal size={16} />} />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Shipments"
        subtitle="Manage courier shipments, delivery status, recipient details, courier charge, and order shipment tracking."
        breadcrumb={adminBreadcrumb}
      />

      <Card>
        <DataTable
          data={shipments?.items ?? []}
          toolbarEnd={
            <div className="flex flex-col gap-3 md:flex-row">
              <Select
                placeholder="Filter by status"
                allowClear
                style={{ width: 180 }}
                value={statusFilter}
                onChange={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
                options={shipmentStatusOptions}
              />

              <Select
                placeholder="Filter by courier"
                allowClear
                showSearch
                style={{ width: 180 }}
                value={courierId || undefined}
                onChange={(value) => {
                  setCourierId(value || "");
                  setCurrentPage(1);
                }}
                options={courierOptions}
                optionFilterProp="label"
              />
            </div>
          }
          columns={columns}
          onSearch={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          loading={isLoading || isFetching}
          pagination={{
            currentPage,
            onPageChange: setCurrentPage,
            totalPages,
          }}
        />
      </Card>
    </div>
  );
};

export default ShipmentPage;
