"use client";

import { App } from "antd";
import { useParams, useRouter } from "next/navigation";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useAuthStore } from "@/stores/auth.store";
import { getApiErrorMessage } from "@/lib/axios";
import { WarehousePayload } from "@/types/product/warehouse";
import WarehouseForm from "../../_components/warehouse-form";
import { useWarehouse, useWarehouseMutation } from "@/lib/api/hooks/warehouse";
import { useState } from "react";

const UpdateWarehousePage = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [submitting, setSubmitting] = useState<boolean>(false);

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const { message } = App.useApp();

  const { data: warehouse } = useWarehouse(businessId, id);
  const { updateWarehouse } = useWarehouseMutation(businessId);

  

  const handleUpdateWarehouse = async (values: WarehousePayload) => {
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

      await updateWarehouse.mutateAsync({
        warehouseId: id,
        payload,
      });

      message.success("Warehouse created successfully");
      router.push("/admin/dashboard/inventory/warehouses");
    } catch (error) {
      message.error(getApiErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div>
      <div
        style={{
          marginBottom: "15px",
        }}
      >
        <PageHeader title="Warehouse Update" breadcrumb={adminBreadcrumb} />
      </div>

      <WarehouseForm
        mode="update"
        initialValues={warehouse}
        onSubmit={handleUpdateWarehouse}
        onCancel={() => router.back()}
        isSubmitting={submitting}
      />
    </div>
  );
};

export default UpdateWarehousePage;
