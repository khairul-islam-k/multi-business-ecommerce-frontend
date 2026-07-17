"use client";
import React, { Dispatch, SetStateAction } from 'react';
import { useUnitMutation } from "@/lib/api/hooks/product-unit";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import UnitForm from '../../units/_components/unit-form';
import { UnitPayload } from '@/types/product/unit';
import { useSwal } from '@/hooks/use-swal';

type UnitProps = {
    setAdditionModalOpen: Dispatch<SetStateAction<boolean>>;
};

const UnitCreateModal = ({ setAdditionModalOpen }: UnitProps) => {
    const business = useAuthStore((s) => s.selectedBusiness);
    const businessId = business?.id ? business?.id : "";
    const { createUnit } = useUnitMutation(businessId);
    const message = useSwal();

    const handleCreateUnit = async (values: UnitPayload) => {
        const payload: UnitPayload = {
            name: values.name.trim(),
            status: values.status,
        };

        try {
            await createUnit.mutateAsync(payload);
            message.success("Unit Created successfully");
            setAdditionModalOpen(false);
        } catch (error) {
            message.error(getApiErrorMessage(error));
        }
    };

    return (
        <div className="space-y-6">
            <UnitForm mode="create" onSubmit={handleCreateUnit} />
        </div>
    );
};

export default UnitCreateModal;