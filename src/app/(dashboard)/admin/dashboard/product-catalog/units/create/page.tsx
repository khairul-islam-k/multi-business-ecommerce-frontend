"use client";

import { App } from "antd";
import { useRouter } from "next/navigation";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useUnitMutation } from "@/lib/api/hooks/product-unit";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";

import UnitForm, { UnitPayload } from "../_components/unit-form";

const CreateUnitPage = () => {
  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ? business?.id : "";
  const { createUnit } = useUnitMutation(businessId);
  const { message } = App.useApp();
  const router = useRouter();

  const handleCreateUnit = async (values: UnitPayload) => {
    const payload: UnitPayload = {
      name: values.name.trim(),
      status: values.status,
    };

    try {
      const res = await createUnit.mutateAsync(payload);
      message.success("Unit Created successfully");
      router.push("/admin/dashboard/product-catalog/units");
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Product Unit"
        subtitle="Add a new product unit with name and status."
        breadcrumb={adminBreadcrumb}
      />
      <UnitForm mode="create" onSubmit={handleCreateUnit} />
    </div>
  );
};

export default CreateUnitPage;
