import React, { Dispatch, SetStateAction, useState } from 'react';
import SupplierForm from '../../supplier/_components/supplier-form';
import { SupplierPayload } from '@/types/suppliers/supplier';
import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'next/router';
import { useSupplierMutation } from '@/lib/api/hooks/supplier';
import { useSwal } from '@/hooks/use-swal';

type SupplierProps = {
    setSupplierOpen: Dispatch<SetStateAction<boolean>>;
}

const CreateSupplierModal = ({ setSupplierOpen }: SupplierProps) => {
    const business = useAuthStore((s) => s.selectedBusiness);
    const businessId = business?.id ?? "";

    const message = useSwal();
    const { createSupplier } = useSupplierMutation(businessId);

    const [submitting, setSubmitting] = useState(false);

    const handleCreateSupplier = async (values: SupplierPayload) => {
        const payload: SupplierPayload = {
            name: values.name?.trim(),
            companyName: values.companyName?.trim(),
            email: values.email?.trim(),
            phone: values.phone?.trim(),
            address: values.address?.trim(),
            city: values.city?.trim(),
            country: values.country?.trim(),
            status: values.status,
            note: values.note?.trim() || "",
        };

        try {
            setSubmitting(true);

            await createSupplier.mutateAsync(payload);
            message.success("Supplier created successfully");
            setSupplierOpen(false);
        } catch (error) {
            message.error(
                error instanceof Error ? error.message : "Failed to create supplier",
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">

            <SupplierForm
                mode="create"
                isSubmitting={submitting}
                onSubmit={handleCreateSupplier}
            />
        </div>
    );
};

export default CreateSupplierModal;