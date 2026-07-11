"use client";

import { App } from "antd";
import { useRouter } from "next/navigation";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useTagsMutation } from "@/lib/api/hooks/product-tags";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";

import TagForm, { TagPayload } from "../_components/tag-form";

const CreateTagPage = () => {
  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ? business?.id : "";
  const { createTags } = useTagsMutation(businessId);
  const { message } = App.useApp();
  const router = useRouter();

  const handleCreateTag = async (values: TagPayload) => {
    const payload: TagPayload = {
      name: values.name.trim(),
      isFeatured: values.isFeatured,
      status: values.status,
    };

    try {
      await createTags.mutateAsync(payload);
      message.success("Tag Created successfully");
      router.push("/admin/dashboard/product-catalog/tags");
    } catch (error) {
      message.success(getApiErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Product Tag"
        subtitle="Add a new product tag to organize, filter, and group products."
        breadcrumb={adminBreadcrumb}
      />

      <TagForm mode="create" onSubmit={handleCreateTag} />
    </div>
  );
};

export default CreateTagPage;
