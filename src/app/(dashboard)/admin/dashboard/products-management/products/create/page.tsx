"use client";

import { useAuthStore } from "@/stores/auth.store";
import ProductForm from "../_components/product-form";
import { useProductMutation } from "@/lib/api/hooks/product";
import { useSwal } from "@/hooks/use-swal";
import { getApiErrorMessage } from "@/lib/axios";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { ProductPayload } from "@/types/product/product";


const CreateProductPage = () => {
  const router = useRouter();
  const business = useAuthStore(s => s.selectedBusiness);
  const businessId = business?.id ? business?.id : '';
  const swal = useSwal();

  const { createProduct } = useProductMutation(businessId);

  const handleCreateProduct = async (values: ProductPayload) => {
    const payload: ProductPayload = {
      images: values.images,
      name: values.name.trim(),
      description: values.description?.trim() || "",
      categoryId: values.categoryId,
      brandId: values.brandId,
      unitId: values.unitId,
      status: values.status,
      tagIds: values.tagIds ?? [],
    };

    try {
      const res = await createProduct.mutateAsync(payload)
      swal.success('create product successfully');
      router.push("/admin/dashboard/products-management/products");
    } catch (error) {
      swal.error(getApiErrorMessage(error));
    }

    // await createProduct.mutateAsync(payload);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Product"
        subtitle="Add a new product with images, category, brand, unit, status, and tags."
        breadcrumb={adminBreadcrumb}
      />

      <ProductForm
        mode="create"
        onSubmit={handleCreateProduct}
      />
    </div>
  );
};

export default CreateProductPage;