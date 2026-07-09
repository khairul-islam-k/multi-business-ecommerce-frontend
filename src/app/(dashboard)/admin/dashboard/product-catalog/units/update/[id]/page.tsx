"use client";

import { App } from "antd";
import { useParams, useRouter } from "next/navigation";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useUnit, useUnitMutation } from "@/lib/api/hooks/product-unit";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import { UnitPayload } from "@/types/product/unit";

import UnitForm from "../../_components/unit-form";

const UpdateUnitPage = () => {
  const { id } = useParams<{ id: string }>();
  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ? business?.id : "";
  const { message } = App.useApp();
  const router = useRouter();

  const { data: unit } = useUnit(businessId, id);
  const { updateUnit } = useUnitMutation(businessId);

  const handleUpdateUnit = async (values: UnitPayload) => {
    const payload: UnitPayload = {
      name: values.name.trim(),
      status: values.status,
    };

    try {
      await updateUnit.mutateAsync({ unitId: id, payload });
      message.success("Unit Updated Successfully");
      router.push("/admin/dashboard/product-catalog/units");
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
    console.log("Update unit payload:", payload);
  };

  return (
    <div>
      <div
        style={{
          marginBottom: "15px",
        }}
      >
        <PageHeader title="Unit update" breadcrumb={adminBreadcrumb} />
      </div>

      <UnitForm
        mode="update"
        initialValues={unit}
        onSubmit={handleUpdateUnit}
      />
    </div>
  );
};

export default UpdateUnitPage;
