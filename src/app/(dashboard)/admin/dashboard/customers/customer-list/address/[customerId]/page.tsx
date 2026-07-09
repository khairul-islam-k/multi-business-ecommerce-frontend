"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useSwal } from "@/hooks/use-swal";
import { useCustomerAddressMutation } from "@/lib/api/hooks/customer-address";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import { CustomerAddressPayload } from "@/types/customer/customerAddress";

import CustomerAddressForm from "../../_components/customer-address-form";

const CreateCustomerAddress = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { customerId } = useParams<{ customerId: string }>();
  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";
  const swal = useSwal();
  const router = useRouter();

  const { createAddress } = useCustomerAddressMutation(businessId);

  const handleSubmit = async (values: CustomerAddressPayload) => {
    setLoading(true);

    try {
      await createAddress.mutateAsync({
        customerId,
        payload: values,
      });
      router.push("/admin/dashboard/customers/customer-list");
      swal.success("Customer address created successfully.");
    } catch (error) {
      swal.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Customer Address"
        subtitle="Add a new address for this customer with address type, city, country, and default status."
        breadcrumb={adminBreadcrumb}
      />

      <CustomerAddressForm loading={loading} onSubmit={handleSubmit} />
    </div>
  );
};

export default CreateCustomerAddress;
