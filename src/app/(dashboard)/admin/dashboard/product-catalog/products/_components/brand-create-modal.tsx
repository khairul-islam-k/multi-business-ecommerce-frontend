"use client";
import React, { Dispatch, SetStateAction } from 'react';
import { App } from "antd";
import { useBrandMutation } from "@/lib/api/hooks/product-brand";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import { BrandPayload } from "@/types/product/brands";
import BrandForm, { BrandFormValues } from '../../brands/_components/brand-form';

type BrandProps = {
    setAdditionModalOpen: Dispatch<SetStateAction<boolean>>;
};

const BrandCreateModal = ({ setAdditionModalOpen }: BrandProps) => {
    const business = useAuthStore((s) => s.selectedBusiness);
      const businessId = business?.id ? business?.id : "";
      const { createBrand } = useBrandMutation(businessId);
      const { message } = App.useApp();
    
      const handleCreateBrand = async (values: BrandFormValues) => {
        const payload: BrandPayload = {
          name: values.name.trim(),
          description: values.description?.trim() || "",
          logoUrl: values.logoUrl?.trim() || "",
          status: values.status,
        };
    
        try {
          await createBrand.mutateAsync(payload);
          message.success("Brand created successfully");
          setAdditionModalOpen(false);
        } catch (error) {
          message.error(getApiErrorMessage(error));
        }
      };

    return (
        <div className="space-y-6">
            <BrandForm mode="create" onSubmit={handleCreateBrand} />
        </div>
    );
};

export default BrandCreateModal;