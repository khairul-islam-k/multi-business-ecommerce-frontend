"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import Loader from "@/components/shared/loader";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useSwal } from "@/hooks/use-swal";
import { useCustomer, useCustomerMutation } from "@/lib/api/hooks/customer";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import { CustomerPayload } from "@/types/customer/customer";

import CustomerForm from "../../_components/customer-form";

const UpdateCustomer = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";
  const { id } = useParams<{ id: string }>();
  const swal = useSwal();
  const router = useRouter();

  const { data: customer, isLoading, isFetching } = useCustomer(businessId, id);
  const { updateCustomer } = useCustomerMutation(businessId);

  const handleSubmit = async (values: CustomerPayload) => {
    if (!businessId) {
      swal.error("Business not selected.");
      return;
    }

    setLoading(true);

    try {
      await updateCustomer.mutateAsync({
        customerId: id,
        payload: values,
      });
      router.push("/admin/dashboard/customers/customer-list");
      swal.success("Customer Updated successfully.");
    } catch (error) {
      swal.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || isFetching) return <Loader />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Update Customer"
        subtitle="Modify customer information, contact details, status, and note."
        breadcrumb={adminBreadcrumb}
      />

      <CustomerForm
        initialData={customer}
        loading={loading}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default UpdateCustomer;
