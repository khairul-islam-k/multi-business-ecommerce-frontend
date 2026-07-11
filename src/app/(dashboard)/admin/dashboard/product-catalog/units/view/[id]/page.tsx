"use client";

import { Button, Card, Empty, Skeleton, Tag } from "antd";
import { ArrowLeft, Pencil } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ReactNode } from "react";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useUnit } from "@/lib/api/hooks/product-unit";
import { useAuthStore } from "@/stores/auth.store";

const UnitDetails = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ? business?.id : "";

  const { data: unit, isLoading, isFetching } = useUnit(businessId, id);

  if (isLoading || isFetching) {
    return (
      <Card>
        <Skeleton active paragraph={{ rows: 5 }} />
      </Card>
    );
  }

  if (!unit) {
    return (
      <Card>
        <Empty description="Unit not found" />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <PageHeader title="Unit Detail" breadcrumb={adminBreadcrumb} />
      </div>

      <div className="flex items-center justify-between">
        <Button icon={<ArrowLeft />} onClick={() => router.back()}>
          Back
        </Button>

        <Button
          type="primary"
          icon={<Pencil />}
          onClick={() =>
            router.push(
              `/admin/dashboard/product-catalog/units/update/${unit.id}`,
            )
          }
        >
          Edit
        </Button>
      </div>

      {/* Unit Details */}
      <Card>
        <div className="mb-6 flex items-center gap-3">
          <h2 className="m-0 text-2xl font-semibold">{unit.name}</h2>

          <Tag color={unit.status === "ACTIVE" ? "green" : "red"}>
            {unit.status}
          </Tag>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem label="Unit Name" value={unit.name} />

          <InfoItem label="Products" value={unit._count?.products ?? 0} />

          <InfoItem
            label="Created At"
            value={new Date(unit.createdAt).toLocaleDateString()}
          />

          <InfoItem
            label="Updated At"
            value={new Date(unit.updatedAt).toLocaleDateString()}
          />

          <InfoItem label="Unit ID" value={unit.id} />

          <InfoItem label="Business ID" value={unit.businessId} />
        </div>
      </Card>
    </div>
  );
};

export default UnitDetails;

type InfoItemProps = {
  label: string;
  value: ReactNode;
};

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="rounded-lg border bg-gray-50 p-4">
      <p className="mb-1 text-sm text-gray-500">{label}</p>
      <p className="m-0 break-all font-medium">{value}</p>
    </div>
  );
}
