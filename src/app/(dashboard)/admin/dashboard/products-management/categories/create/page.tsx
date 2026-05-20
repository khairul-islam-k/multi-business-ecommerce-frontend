"use client";

import { useProductCategoriesMutation } from "@/lib/api/hooks/product-categories";
import ProductCategoryForm, { ProductCategoryFormValues } from "../_components/ProductCategoryForm";
import { useAuthStore } from "@/stores/auth.store";
import { useSwal } from "@/hooks/use-swal";

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

const CreateProductCategoryPage = () => {
    const swal = useSwal();
    const business = useAuthStore(s => s.selectedBusiness);
    console.log(business, 'business');
    const businessId = business?.id ? business?.id : '';
    const { createCategories } = useProductCategoriesMutation(businessId);

    const handleCreate = async (values: ProductCategoryFormValues) => {
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
            await createCategories.mutateAsync(payload);
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
            await createCategories.mutateAsync(payload);
            swal.success('categories success');
        }
    };

    return (
        <div style={{ padding: 24 }}>
            <ProductCategoryForm
                parentCategories={parentCategories}
                onSubmit={handleCreate}
            />
        </div>
    );
};

export default CreateProductCategoryPage;