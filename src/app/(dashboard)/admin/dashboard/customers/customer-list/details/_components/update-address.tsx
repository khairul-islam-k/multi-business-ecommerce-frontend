"use client";
import { CustomerAddressPayload, CustomerAddressResponse } from '@/types/customer/customerAddress';
import React, { useState } from 'react';
import CustomerAddressForm from '../../_components/customer-address-form';
import { useAuthStore } from '@/stores/auth.store';
import { useSwal } from '@/hooks/use-swal';
import { useCustomerAddressMutation } from '@/lib/api/hooks/customer-address';
import { getApiErrorMessage } from '@/lib/axios';

type AddressProps = {
    customerId: string;
    singleAddress: CustomerAddressResponse;
}

const UpdateAddress = ({ customerId, singleAddress }: AddressProps) => {
    const [loading, setLoading] = useState<boolean>(false);
    const business = useAuthStore((s) => s.selectedBusiness);
    const businessId = business?.id ?? "";
    const swal = useSwal();

    const { updateAddress } = useCustomerAddressMutation(businessId);

    const handleSubmit = async (values: CustomerAddressPayload) => {

        setLoading(true);

        try {
            const res = await updateAddress.mutateAsync({
                customerId,
                addressId: singleAddress.id,
                payload: values,
            });
            console.log('res', res);
            swal.success("Customer address created successfully.");
        } catch (error) {
            swal.error(getApiErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <CustomerAddressForm
                initialData={singleAddress}
                loading={loading}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default UpdateAddress;