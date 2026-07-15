"use client";

import { App } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useWarehouseMutation } from "@/lib/api/hooks/warehouse";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import { WarehousePayload } from "@/types/product/warehouse";

import WarehouseForm from "../_components/warehouse-form";

export default function CreateWarehousePage() {
  const router = useRouter();

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const { message } = App.useApp();
  const { createWarehouse } = useWarehouseMutation(businessId);

  const [submitting, setSubmitting] = useState(false);

  const handleCreateWarehouse = async (values: WarehousePayload) => {
    const payload: WarehousePayload = {
      name: values.name.trim(),

      ...(values.phone?.trim()
        ? {
            phone: values.phone.trim(),
          }
        : {}),

      ...(values.address?.trim()
        ? {
            address: values.address.trim(),
          }
        : {}),

      ...(values.redxAreaId
        ? {
            redxAreaId: values.redxAreaId,
            redxAreaName: values.redxAreaName,
            redxPostCode: values.redxPostCode,
          }
        : {}),

      ...(values.redxPickupStoreId
        ? {
            redxPickupStoreId: values.redxPickupStoreId,
          }
        : {}),

      ...(values.status
        ? {
            status: values.status,
          }
        : {}),
    };

    try {
      setSubmitting(true);

      console.log('transfer', payload);

      const res = await createWarehouse.mutateAsync(payload);

      message.success("Warehouse created successfully");
      router.push("/admin/dashboard/inventory/warehouses");
    } catch (error) {
      message.error(getApiErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Warehouse"
        subtitle="Add a new warehouse with contact information, address, and status."
        breadcrumb={adminBreadcrumb}
      />

      <WarehouseForm
        mode="create"
        isSubmitting={submitting}
        onSubmit={handleCreateWarehouse}
        onCancel={() => router.back()}
      />
    </div>
  );
}
