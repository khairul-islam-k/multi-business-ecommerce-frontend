"use client";

import PageHeader from "@/components/shared/page-header";
import Loader from "@/components/shared/loader";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import {
  useFinanceAccount,
  useFinanceAccountMutation,
} from "@/lib/api/hooks/finance-account";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import type { FinanceAccountPayload } from "@/types/finance/account";
import { Empty } from "antd";
import { useParams, useRouter } from "next/navigation";
import FinanceAccountForm from "../../_components/finance-account-form";
import { useSwal } from "@/hooks/use-swal";

const UpdateFinanceAccountPage = () => {
  const swal = useSwal();
  const router = useRouter();
  const { accountId } = useParams<{ accountId: string }>();

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const { data: account, isLoading, isFetching } = useFinanceAccount(
    businessId,
    accountId
  );

  const { updateFinanceAccount } = useFinanceAccountMutation(businessId);

  const handleSubmit = async (values: FinanceAccountPayload) => {
    try {
      const res = await updateFinanceAccount.mutateAsync({
        accountId,
        payload: values,
      });

      console.log('res', res);

      swal.success("Account updated successfully.");
      router.push("/admin/dashboard/finance/accounts");
    } catch (error) {
      swal.error(getApiErrorMessage(error));
    }
  };

  if (isLoading || isFetching) {
    return <Loader />;
  }

  if (!account) {
    return <Empty description="Account not found" />;
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Update Account"
        subtitle="Update finance account information."
        breadcrumb={adminBreadcrumb}
      />

      <FinanceAccountForm
        submitText="Update Account"
        loading={updateFinanceAccount.isPending}
        initialValues={{
          name: account.name,
          accountType: account.accountType,
          accountNumber: account.accountNumber,
          currencyCode: account.currencyCode,
          openingBalance: Number(account.openingBalance ?? 0),
          status: account.status,
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default UpdateFinanceAccountPage;