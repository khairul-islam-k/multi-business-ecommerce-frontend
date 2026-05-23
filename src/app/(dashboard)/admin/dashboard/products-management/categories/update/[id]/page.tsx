"use client";

import { useParams } from "next/navigation";
import ProductCategoryForm, { ProductCategoryFormValues } from "../../_components/ProductCategoryForm";
import { useCategory, useProductCategoriesMutation } from "@/lib/api/hooks/product-categories";
import { useAuthStore } from "@/stores/auth.store";
import { useSwal } from "@/hooks/use-swal";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const parentCategories = [
  {
    label: "Shoes",
    value: "2d8d0f8f-95aa-4f23-a2fd-0ca6f5f8a913",
  },
  {
    label: "Clothing",
    value: "1a7d0f8f-95aa-4f23-a2fd-0ca6f5f8a999",
  },
];

const UpdateProductCategoryPage = () => {
  const swal = useSwal();
  const business = useAuthStore(s => s.selectedBusiness);
  const businessId = business?.id ? business?.id : '';;
  const { id } = useParams<{ id: string }>();
  const { data: category } = useCategory(businessId, id);
  const { updateCategories } = useProductCategoriesMutation(businessId);


  const handleUpdate = async (values: ProductCategoryFormValues) => {
    const { parentId, ...resData } = values;
    if (!parentId) {
      console.log(resData, 'data');
      const payload = {
        name: resData.name,
        description: resData.description || "",
        imageUrl: resData.imageUrl || "",
        status: resData.status,
        sortOrder: resData.sortOrder ?? 0
      };
      await updateCategories.mutateAsync({ categoryId: id, payload });
      swal.success('categories success');
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
      swal.success('categories success');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Update Product Category"
        subtitle="Edit category information, image, parent category, status, and sorting."
        breadcrumb={adminBreadcrumb}
      />
      <ProductCategoryForm
        initialData={category}
        parentCategories={parentCategories}
        onSubmit={handleUpdate}
      />
    </div>
  );
};

export default UpdateProductCategoryPage;