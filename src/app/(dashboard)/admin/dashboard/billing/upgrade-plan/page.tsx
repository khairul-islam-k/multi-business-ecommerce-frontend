"use client";

import { useState } from "react";
import { Col, Empty, Row } from "antd";

import { getApiErrorMessage } from "@/lib/axios";
import {
  useTenantCurrentSubscription,
  useTenantPackageMutations,
  useTenantPackagePlans,
} from "@/lib/api";
import type { PackagePlan } from "@/lib/api";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import Loader from "@/components/shared/loader";
import Pagination from "@/components/shared/pagination";
import { useSwal } from "@/hooks/use-swal";
import PlanCard from "../_components/plan-card";
import { money } from "../_utils/package-display";

export default function UpgradePlanPage() {
  const swal = useSwal();
  const [currentPage, setCurrentPage] = useState(1);
  const plans = useTenantPackagePlans({ page: currentPage, limit: 9 });
  const currentSubscription = useTenantCurrentSubscription();
  const mutations = useTenantPackageMutations();

  const handleCheckout = async (plan: PackagePlan) => {
    const { isConfirmed } = await swal.confirm({
      title: "Create checkout?",
      text: `A pending payment for ${money(plan.price, plan.currencyCode)} will be created for ${plan.name}.`,
      confirmButtonText: "Create checkout",
    });

    if (!isConfirmed) return;

    try {
      const payment = await mutations.checkoutPlan.mutateAsync(plan.id);
      const confirm = await swal.confirm({
        title: "Confirm mock payment?",
        text: `Confirm payment ${money(payment.amount, payment.currencyCode)} now?`,
        confirmButtonText: "Confirm payment",
      });

      if (confirm.isConfirmed) {
        await mutations.confirmMockPayment.mutateAsync(payment.id);
        swal.success("Plan changed successfully.");
      } else {
        swal.success("Checkout created. Confirm it before it expires.");
      }
    } catch (error) {
      swal.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Upgrade Plan"
        subtitle="Choose an available package plan for this tenant account."
        breadcrumb={adminBreadcrumb}
      />

      {plans.isLoading ? (
        <Loader
          label="Loading plans"
          description="Fetching available packages."
        />
      ) : plans.data?.items.length ? (
        <>
          <Row gutter={[16, 16]}>
            {plans.data.items.map((plan) => (
              <Col xs={24} md={12} xl={8} key={plan.id}>
                <PlanCard
                  plan={plan}
                  currentPlanId={currentSubscription.data?.packageId}
                  loading={
                    mutations.checkoutPlan.isPending ||
                    mutations.confirmMockPayment.isPending
                  }
                  onCheckout={handleCheckout}
                />
              </Col>
            ))}
          </Row>

          {plans.data.meta.totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={plans.data.meta.totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      ) : (
        <Empty description="No package plans are available right now." />
      )}
    </div>
  );
}
