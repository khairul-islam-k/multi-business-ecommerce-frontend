"use client";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useFinanceAccountMutation } from "@/lib/api/hooks/finance-account";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import type { FinanceAccountPayload } from "@/types/finance/account";
import { App } from "antd";
import { useRouter } from "next/navigation";
import FinanceAccountForm from "../_components/finance-account-form";

const CreateFinanceAccountPage = () => {
  const { message } = App.useApp();
  const router = useRouter();

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const { createFinanceAccount } = useFinanceAccountMutation(businessId);

  const handleSubmit = async (values: FinanceAccountPayload) => {
    try {
      await createFinanceAccount.mutateAsync(values);

      message.success("Account created successfully.");
      router.push("/admin/dashboard/finance/accounts");
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Create Account"
        subtitle="Create a new finance account for cash, bank, mobile banking, or payment gateway."
        breadcrumb={adminBreadcrumb}
      />

      <FinanceAccountForm
        submitText="Create Account"
        loading={createFinanceAccount.isPending}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default CreateFinanceAccountPage;