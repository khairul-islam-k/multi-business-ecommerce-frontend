"use client";

import { App } from "antd";
import { useRouter } from "next/navigation";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useProductCategoriesMutation } from "@/lib/api/hooks/product-categories";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";

import ProductCategoryForm, {
  ProductCategoryFormValues,
} from "../_components/product-category-form";

const CreateProductCategoryPage = () => {
  const { message } = App.useApp();
  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ? business?.id : "";
  const { createCategories } = useProductCategoriesMutation(businessId);
  const router = useRouter();

  const handleCreate = async (values: ProductCategoryFormValues) => {
    const { parentId, ...resData } = values;
    try {
      if (!parentId) {
        const payload = {
          name: resData.name,
          description: resData.description || "",
          imageUrl: resData.imageUrl || "",
          status: resData.status,
        };
        await createCategories.mutateAsync(payload);
        message.success("Category has been created");
        router.push("/admin/dashboard/product-catalog/categories");
      } else {
        const payload = {
          name: values.name,
          description: values.description || "",
          imageUrl: values.imageUrl || "",
          status: values.status,
          parentId: values.parentId,
        };
        await createCategories.mutateAsync(payload);
        message.success("Category has been created");
        router.push("/admin/dashboard/product-catalog/categories");
      }
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Product Category"
        subtitle="Add a new product category with image, parent category, and status."
        breadcrumb={adminBreadcrumb}
      />
      <ProductCategoryForm onSubmit={handleCreate} />
    </div>
  );
};

export default CreateProductCategoryPage;
