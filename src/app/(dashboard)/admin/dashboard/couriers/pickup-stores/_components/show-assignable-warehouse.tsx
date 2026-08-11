"use client";

import { useWarehousesQuery } from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";
import { CourierConfigResponse } from "@/types/courier/courier";
import { WarehouseResponse } from "@/types/product/warehouse";
import { Empty, Skeleton, Tag } from "antd";
import { Building2, MapPin, Phone, Warehouse } from "lucide-react";

type ShowAssignableWarehouseProps = {
  singleCourier: CourierConfigResponse | undefined;
  storeId: string;
};

const ShowAssignableWarehouse = ({
  singleCourier,
  storeId,
}: ShowAssignableWarehouseProps) => {
  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const { data: warehouses, isLoading } =
    useWarehousesQuery(businessId);

  const courierCode = singleCourier?.courier?.code;

  let warehouse: WarehouseResponse | undefined;

  if (warehouses?.items && storeId) {
    switch (courierCode) {
      case "REDX": {
        warehouse = warehouses.items.find(
          (item) => item.redxStoreId === storeId,
        );
        break;
      }

      case "PATHAO": {
        warehouse = warehouses.items.find(
          (item) => item.pathaoStoreId === storeId,
        );
        break;
      }

      default: {
        warehouse = undefined;
      }
    }
  }

  if (isLoading) {
    return <Skeleton active />;
  }

  if (!warehouse) {
    return (
      <div className="py-6">
        <Empty description="No assigned warehouse found" />
      </div>
    );
  }

  const courierStoreId =
    courierCode === "REDX"
      ? warehouse.redxStoreId
      : courierCode === "PATHAO"
        ? warehouse.pathaoStoreId
        : null;

  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-gray-100 p-2">
          <Building2 size={20} />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900">
            {warehouse.name}
          </h3>

          <p className="mt-1 break-all text-sm text-gray-500">
            {warehouse.id}
          </p>
        </div>

        <Tag color={warehouse.status === "ACTIVE" ? "green" : "default"}>
          {warehouse.status}
        </Tag>
      </div>

      <div className="mt-5 space-y-3">
        <div className="flex items-start gap-2 text-sm">
          <MapPin
            size={16}
            className="mt-0.5 shrink-0 text-gray-400"
          />

          <span className="text-gray-700">
            {warehouse.address || "No address available"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Phone size={16} className="shrink-0 text-gray-400" />

          <span className="text-gray-700">
            {warehouse.phone || "No phone available"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Warehouse size={16} className="shrink-0 text-gray-400" />

          <span className="text-gray-500">
            Courier Store ID:
          </span>

          <span className="font-medium text-gray-900">
            {courierStoreId || "-"}
          </span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
        <div>
          <p className="text-xs text-gray-500">Stocks</p>

          <p className="mt-1 font-semibold">
            {warehouse._count.stocks}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Movements</p>

          <p className="mt-1 font-semibold">
            {warehouse._count.movements}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShowAssignableWarehouse;