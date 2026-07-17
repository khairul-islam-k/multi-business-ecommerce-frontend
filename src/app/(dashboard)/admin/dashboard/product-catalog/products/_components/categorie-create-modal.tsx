"use client";

import { App } from "antd";
import { useRouter } from "next/navigation";

import { useProductCategoriesMutation } from "@/lib/api/hooks/product-categories";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import ProductCategoryForm, { ProductCategoryFormValues } from '../../categories/_components/product-category-form';
import { Dispatch, SetStateAction } from "react";

type CategoryProps = {
  setAdditionModalOpen: Dispatch<SetStateAction<boolean>>;
};

const CategoryCreateModal = ({setAdditionModalOpen}: CategoryProps) => {
    const { message } = App.useApp();
      const business = useAuthStore((s) => s.selectedBusiness);
      const businessId = business?.id ? business?.id : "";
      const { createCategories } = useProductCategoriesMutation(businessId);
    
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
          }
          setAdditionModalOpen(false);
        } catch (error) {
          message.error(getApiErrorMessage(error));
        }
      };
    
      return (
        <div className="space-y-6">
          <ProductCategoryForm onSubmit={handleCreate} />
        </div>
      );
};

export default CategoryCreateModal;