"use client";

import { useMemo, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  RetweetOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { App, Button, Modal, Select, Space, Tabs, Tag } from "antd";

import { getApiErrorMessage } from "@/lib/axios";
import {
  useAdminPackageMutations,
  usePackagePlans,
  useTenantSubscriptions,
  useTenants,
} from "@/lib/api";
import type {
  ApiId,
  PackagePlan,
  PackagePlanPayload,
  PackageQuery,
  PackageStatus,
  PackageSubscriptionStatus,
  TenantSubscription,
  TenantSubscriptionQuery,
} from "@/lib/api";
import PageHeader from "@/components/shared/page-header";
import { superAdminBreadcrumb } from "@/config/breadcrumb.config";
import { Column, DataTable } from "@/components/shared/data-table";
import { useSwal } from "@/hooks/use-swal";
import PackagePlanForm from "./_components/package-plan-form";
import SubscriptionForm from "./_components/subscription-form";
import {
  money,
  optionLabel,
  packageStatusOptions,
  subscriptionStatusOptions,
} from "./_utils/package-options";

const statusColor: Record<string, string> = {
  ACTIVE: "green",
  ARCHIVED: "default",
  CANCELLED: "default",
  EXPIRED: "red",
  INACTIVE: "orange",
  PAST_DUE: "red",
  TRIALING: "blue",
};

export default function PackagesPage() {
  const swal = useSwal();
  const { message, modal } = App.useApp();
  const mutations = useAdminPackageMutations();

  const [planPage, setPlanPage] = useState(1);
  const [planSearch, setPlanSearch] = useState("");
  const [planStatus, setPlanStatus] = useState<PackageStatus | undefined>();
  const [subscriptionPage, setSubscriptionPage] = useState(1);
  const [subscriptionStatus, setSubscriptionStatus] = useState<
    PackageSubscriptionStatus | undefined
  >();

  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PackagePlan | null>(null);
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [changingSubscription, setChangingSubscription] =
    useState<TenantSubscription | null>(null);

  const planQuery = useMemo<PackageQuery>(
    () => ({
      page: planPage,
      limit: 10,
      search: planSearch,
      status: planStatus,
    }),
    [planPage, planSearch, planStatus],
  );
  const subscriptionQuery = useMemo<TenantSubscriptionQuery>(
    () => ({
      page: subscriptionPage,
      limit: 10,
      status: subscriptionStatus,
    }),
    [subscriptionPage, subscriptionStatus],
  );

  const plans = usePackagePlans(planQuery);
  const subscriptions = useTenantSubscriptions(subscriptionQuery);
  const tenantOptions = useTenants({ page: 1, limit: 100 });
  const planOptions = usePackagePlans({
    page: 1,
    limit: 100,
    status: "ACTIVE",
  });

  const packageStatusFilter = (
    value: PackageStatus | undefined,
    onChange: (status?: PackageStatus) => void,
  ) => (
    <Select
      allowClear
      placeholder="Status"
      style={{ width: 150 }}
      value={value}
      onChange={onChange}
      options={packageStatusOptions.map((status) => ({
        label: optionLabel(status),
        value: status,
      }))}
    />
  );

  const subscriptionStatusFilter = (
    <Select
      allowClear
      placeholder="Status"
      style={{ width: 170 }}
      value={subscriptionStatus}
      onChange={(value) => {
        setSubscriptionStatus(value);
        setSubscriptionPage(1);
      }}
      options={subscriptionStatusOptions.map((status) => ({
        label: optionLabel(status),
        value: status,
      }))}
    />
  );

  const planColumns: Column<PackagePlan>[] = [
    { key: "name", label: "Plan", type: "primary" },
    {
      key: "price",
      label: "Price",
      render: (plan) => money(plan.price, plan.currencyCode),
    },
    {
      key: "billingCycle",
      label: "Billing",
      render: (plan) => optionLabel(plan.billingCycle),
    },
    {
      key: "limits",
      label: "Limits",
      render: (plan) => plan.limits?.length ?? 0,
    },
    {
      key: "status",
      label: "Status",
      type: "meta",
      render: (plan) => (
        <Tag color={statusColor[plan.status]}>{optionLabel(plan.status)}</Tag>
      ),
    },
    {
      key: "subscriptions",
      label: "Subscriptions",
      render: (plan) => plan._count?.subscriptions ?? 0,
    },
  ];

  const subscriptionColumns: Column<TenantSubscription>[] = [
    {
      key: "tenant",
      label: "Tenant",
      type: "primary",
      render: (subscription) => subscription.tenant?.name ?? "-",
    },
    {
      key: "package",
      label: "Plan",
      render: (subscription) => subscription.package?.name ?? "-",
    },
    {
      key: "price",
      label: "Price",
      render: (subscription) =>
        money(subscription.price, subscription.currencyCode),
    },
    {
      key: "status",
      label: "Status",
      type: "meta",
      render: (subscription) => (
        <Tag color={statusColor[subscription.status]}>
          {optionLabel(subscription.status)}
        </Tag>
      ),
    },
    {
      key: "currentPeriodEnd",
      label: "Period ends",
      render: (subscription) =>
        subscription.currentPeriodEnd
          ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
          : "-",
    },
  ];

  const closePlanModal = () => {
    setPlanModalOpen(false);
    setEditingPlan(null);
  };

  const submitPlan = async (payload: PackagePlanPayload) => {
    try {
      if (editingPlan) {
        await mutations.updatePlan.mutateAsync({
          planId: editingPlan.id,
          payload,
        });
        message.success("Package plan updated successfully.");
      } else {
        console.log('payload', payload);
        await mutations.createPlan.mutateAsync(payload);
        message.success("Package plan created successfully.");
      }
      closePlanModal();
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
  };


  const deletePlan = (plan: PackagePlan) => {
    modal.confirm({
      title: "Delete package plan?",
      content: `${plan.name} will be archived and removed from active lists.`,
      okText: "Delete plan",
      cancelText: "Cancel",
      okButtonProps: {
        danger: true,
      },
      async onOk() {
        try {
          await mutations.deletePlan.mutateAsync(plan.id);
          message.success("Package plan deleted successfully.");
        } catch (error) {
          message.error(getApiErrorMessage(error));
        }
      },
    });
  };


  const createSubscription = async (payload: {
    tenantId?: ApiId;
    planId: ApiId;
  }) => {
    if (!payload.tenantId) return;

    try {
      await mutations.createSubscription.mutateAsync({
        tenantId: payload.tenantId,
        planId: payload.planId,
      });
      setSubscriptionModalOpen(false);
      message.success("Tenant subscription created successfully.");
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
  };

  const changeSubscriptionPlan = async (payload: { planId: ApiId }) => {
    if (!changingSubscription) return;

    try {
      await mutations.changeSubscriptionPlan.mutateAsync({
        subscriptionId: changingSubscription.id,
        payload,
      });
      setChangingSubscription(null);
      message.success("Subscription plan changed successfully.");
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
  };

  const cancelSubscription = async (subscription: TenantSubscription) => {
    const { isConfirmed } = await swal.confirm({
      title: "Cancel subscription?",
      text: `${subscription.tenant?.name ?? "This tenant"} will lose the current package subscription.`,
      confirmButtonText: "Cancel subscription",
    });
    if (!isConfirmed) return;

    try {
      await mutations.cancelSubscription.mutateAsync({
        subscriptionId: subscription.id,
        payload: {},
      });
      message.success("Subscription cancelled successfully.");
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Packages"
        subtitle="Manage platform plans, add-ons, and tenant package subscriptions."
        breadcrumb={superAdminBreadcrumb}
      />

      <Tabs
        items={[
          {
            key: "plans",
            label: "Plans",
            children: (
              <DataTable
                data={plans.data?.items ?? []}
                columns={planColumns}
                loading={plans.isLoading || plans.isFetching}
                onSearch={(value) => {
                  setPlanSearch(value);
                  setPlanPage(1);
                }}
                extra={packageStatusFilter(planStatus, (value) => {
                  setPlanStatus(value);
                  setPlanPage(1);
                })}
                toolbarEnd={
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setPlanModalOpen(true)}
                  >
                    Create plan
                  </Button>
                }
                actions={(plan) => (
                  <Space>
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => {
                        setEditingPlan(plan);
                        setPlanModalOpen(true);
                      }}
                    />
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => deletePlan(plan)}
                    />
                  </Space>
                )}
                pagination={{
                  currentPage: planPage,
                  totalPages: plans.data?.meta.totalPages ?? 1,
                  onPageChange: setPlanPage,
                }}
              />
            ),
          },
          {
            key: "subscriptions",
            label: "Subscriptions",
            children: (
              <DataTable
                data={subscriptions.data?.items ?? []}
                columns={subscriptionColumns}
                loading={subscriptions.isLoading || subscriptions.isFetching}
                extra={subscriptionStatusFilter}
                toolbarEnd={
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setSubscriptionModalOpen(true)}
                  >
                    Create subscription
                  </Button>
                }
                actions={(subscription) => (
                  <Space>
                    {/* <Button
                      icon={<RetweetOutlined />}
                      onClick={() => setChangingSubscription(subscription)}
                    /> */}
                    <Button
                      danger
                      icon={<StopOutlined />}
                      disabled={subscription.status === "CANCELLED"}
                      onClick={() => cancelSubscription(subscription)}
                    />
                  </Space>
                )}
                pagination={{
                  currentPage: subscriptionPage,
                  totalPages: subscriptions.data?.meta.totalPages ?? 1,
                  onPageChange: setSubscriptionPage,
                }}
              />
            ),
          },
        ]}
      />

      <Modal
        title={editingPlan ? "Edit package plan" : "Create package plan"}
        open={planModalOpen}
        onCancel={closePlanModal}
        footer={null}
        width={900}
        destroyOnHidden
      >
        <PackagePlanForm
          initialValue={editingPlan}
          loading={
            mutations.createPlan.isPending || mutations.updatePlan.isPending
          }
          onSubmit={submitPlan}
        />
      </Modal>

      <Modal
        title="Create tenant subscription"
        open={subscriptionModalOpen}
        onCancel={() => setSubscriptionModalOpen(false)}
        footer={null}
        destroyOnHidden
      >
        <SubscriptionForm
          tenants={tenantOptions.data?.items ?? []}
          plans={planOptions.data?.items ?? []}
          loading={mutations.createSubscription.isPending}
          onSubmit={createSubscription}
        />
      </Modal>

      <Modal
        title="Change subscription plan"
        open={Boolean(changingSubscription)}
        onCancel={() => setChangingSubscription(null)}
        footer={null}
        destroyOnHidden
      >
        <SubscriptionForm
          showTenant={false}
          plans={planOptions.data?.items ?? []}
          loading={mutations.changeSubscriptionPlan.isPending}
          onSubmit={changeSubscriptionPlan}
        />
      </Modal>
    </div>
  );
}
