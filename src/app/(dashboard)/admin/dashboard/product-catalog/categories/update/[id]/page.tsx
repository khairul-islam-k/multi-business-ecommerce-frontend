"use client";

import { App } from "antd";
import { useParams, useRouter } from "next/navigation";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import {
  useCategory,
  useProductCategoriesMutation,
} from "@/lib/api/hooks/product-categories";
import { useAuthStore } from "@/stores/auth.store";

import ProductCategoryForm, {
  ProductCategoryFormValues,
} from "../../_components/product-category-form";

const UpdateProductCategoryPage = () => {
  const { message } = App.useApp();
  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ? business?.id : "";
  const { id } = useParams<{ id: string }>();
  const { data: category } = useCategory(businessId, id);
  const { updateCategories } = useProductCategoriesMutation(businessId);
  const router = useRouter();

  const handleUpdate = async (values: ProductCategoryFormValues) => {
    const { parentId, ...resData } = values;
    if (!parentId) {
      console.log(resData, "data");
      const payload = {
        name: resData.name,
        description: resData.description || "",
        imageUrl: resData.imageUrl || "",
        status: resData.status,
        sortOrder: resData.sortOrder ?? 0,
      };
      await updateCategories.mutateAsync({ categoryId: id, payload });
      message.success("Category updated successfully");
      router.push("/admin/dashboard/product-catalog/categories");
    } else {
      const payload = {
        name: values.name,
        description: values.description || "",
        imageUrl: values.imageUrl || "",
        status: values.status,
        sortOrder: values.sortOrder ?? 0,
        parentId: values.parentId ?? "",
      };
      await updateCategories.mutateAsync({ categoryId: id, payload });
      message.success("Category updated successfully");
      router.push("/admin/dashboard/product-catalog/categories");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Update Product Category"
        subtitle="Edit category information, image, parent category, status, and sorting."
        breadcrumb={adminBreadcrumb}
      />
      <ProductCategoryForm initialData={category} onSubmit={handleUpdate} />
    </div>
  );
};

export default UpdateProductCategoryPage;
