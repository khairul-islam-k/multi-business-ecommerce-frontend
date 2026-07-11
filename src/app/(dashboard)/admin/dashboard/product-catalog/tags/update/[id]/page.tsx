"use client";

import { App } from "antd";
import { useParams, useRouter } from "next/navigation";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useTags, useTagsMutation } from "@/lib/api/hooks/product-tags";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import { ProductTagPayload } from "@/types/product/product";

import TagForm from "../../_components/tag-form";

const UpdateTagPage = () => {
  const { id } = useParams<{ id: string }>();
  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ? business?.id : "";
  const { message } = App.useApp();
  const router = useRouter();

  const { data: tag } = useTags(businessId, id);
  const { updateTags } = useTagsMutation(businessId);

  const handleUpdateTag = async (values: ProductTagPayload) => {
    const payload: ProductTagPayload = {
      name: values.name.trim(),
      isFeatured: values.isFeatured,
      status: values.status,
    };

    try {
      await updateTags.mutateAsync({
        tagId: id,
        payload,
      });
      message.success("Tag Updated successfully");
      router.push("/admin/dashboard/product-catalog/tags");
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Update Product Tag"
        subtitle="Edit product tag information, status, and product organization settings."
        breadcrumb={adminBreadcrumb}
      />
      <TagForm mode="update" initialValues={tag} onSubmit={handleUpdateTag} />
    </div>
  );
};

export default UpdateTagPage;
