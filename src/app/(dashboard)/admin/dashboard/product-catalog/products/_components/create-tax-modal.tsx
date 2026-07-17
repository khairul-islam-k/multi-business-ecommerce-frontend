"use client";
import React, { Dispatch, SetStateAction } from 'react';
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useTaxMutation } from "@/lib/api/hooks/tax";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import { TaxPayload } from "@/types/finance/tax";
import { useSwal } from '@/hooks/use-swal';
import TaxForm from '../../../finance/tax/_components/tax-form';

type TaxProps = {
    setAdditionModalOpen: Dispatch<SetStateAction<boolean>>;
};

const CreateTaxModal = ({ setAdditionModalOpen }: TaxProps) => {
    const router = useRouter();
    const business = useAuthStore((s) => s.selectedBusiness);
    const businessId = business?.id ?? "";

    const message = useSwal();
    const { createTax } = useTaxMutation(businessId);

    const [submitting, setSubmitting] = useState(false);

    const handleCreateTax = async (values: TaxPayload) => {
        const payload: TaxPayload = {
            name: values.name.trim(),
            rate: Number(values.rate),
            description: values.description.trim(),
            status: values.status,
        };

        try {
            setSubmitting(true);

            await createTax.mutateAsync(payload);
            message.success("Tax created successfully");
            setAdditionModalOpen(false);
        } catch (error) {
            message.error(getApiErrorMessage(error));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">

            <TaxForm
                mode="create"
                isSubmitting={submitting}
                onSubmit={handleCreateTax}
            />
        </div>
    );
};

export default CreateTaxModal;