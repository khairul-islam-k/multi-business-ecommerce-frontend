"use client";

import { useMemo, useState } from "react";
import { Col, Empty, Row } from "antd";

import { getApiErrorMessage } from "@/lib/axios";
import {
  useTenantCurrentSubscription,
  useTenantPackageAddons,
  useTenantPackageMutations,
} from "@/lib/api";
import type { PackageAddon, PackageSubscriptionAddon } from "@/lib/api";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import Loader from "@/components/shared/loader";
import Pagination from "@/components/shared/pagination";
import { useSwal } from "@/hooks/use-swal";
import AddonCard from "../_components/addon-card";
import { money } from "../_utils/package-display";

export default function AddOnsPage() {
  const swal = useSwal();
  const [currentPage, setCurrentPage] = useState(1);
  const addons = useTenantPackageAddons({ page: currentPage, limit: 9 });
  const currentSubscription = useTenantCurrentSubscription();
  const mutations = useTenantPackageMutations();

  const activeAddons = useMemo(() => {
    const map = new Map<string, PackageSubscriptionAddon>();
    currentSubscription.data?.addons
      ?.filter((item) => item.status === "ACTIVE")
      .forEach((item) => map.set(item.addonId, item));
    return map;
  }, [currentSubscription.data?.addons]);

  const checkoutAddon = async (addon: PackageAddon, quantity: number) => {
    const { isConfirmed } = await swal.confirm({
      title: "Create add-on checkout?",
      text: `${addon.name} x${quantity} will create a pending payment for ${money(Number(addon.price) * quantity, addon.currencyCode)}.`,
      confirmButtonText: "Create checkout",
    });

    if (!isConfirmed) return;

    try {
      const payment = await mutations.checkoutAddon.mutateAsync({
        addonId: addon.id,
        payload: { quantity },
      });
      const confirm = await swal.confirm({
        title: "Confirm mock payment?",
        text: `Confirm payment ${money(payment.amount, payment.currencyCode)} now?`,
        confirmButtonText: "Confirm payment",
      });

      if (confirm.isConfirmed) {
        await mutations.confirmMockPayment.mutateAsync(payment.id);
        swal.success("Add-on added successfully.");
      } else {
        swal.success("Checkout created. Confirm it before it expires.");
      }
    } catch (error) {
      swal.error(getApiErrorMessage(error));
    }
  };

  const removeAddon = async (subscriptionAddon: PackageSubscriptionAddon) => {
    const { isConfirmed } = await swal.confirm({
      title: "Remove add-on?",
      text: `${subscriptionAddon.addon?.name ?? "This add-on"} will be removed from your current subscription.`,
      confirmButtonText: "Remove add-on",
    });

    if (!isConfirmed) return;

    try {
      await mutations.removeAddon.mutateAsync(subscriptionAddon.id);
      swal.success("Subscription add-on removed successfully.");
    } catch (error) {
      swal.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add-ons"
        subtitle="Extend the current subscription with additional package limits."
        breadcrumb={adminBreadcrumb}
      />

      {addons.isLoading ? (
        <Loader
          label="Loading add-ons"
          description="Fetching available package add-ons."
        />
      ) : addons.data?.items.length ? (
        <>
          <Row gutter={[16, 16]}>
            {addons.data.items.map((addon) => (
              <Col xs={24} md={12} xl={8} key={addon.id}>
                <AddonCard
                  addon={addon}
                  activeAddon={activeAddons.get(addon.id)}
                  checkoutLoading={
                    mutations.checkoutAddon.isPending ||
                    mutations.confirmMockPayment.isPending
                  }
                  removeLoading={mutations.removeAddon.isPending}
                  onCheckout={checkoutAddon}
                  onRemove={removeAddon}
                />
              </Col>
            ))}
          </Row>

          {addons.data.meta.totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={addons.data.meta.totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      ) : (
        <Empty description="No package add-ons are available right now." />
      )}
    </div>
  );
}
