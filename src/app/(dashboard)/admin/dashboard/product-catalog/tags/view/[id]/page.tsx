"use client";

import { Button, Card, Empty, Skeleton, Tag } from "antd";
import { ArrowLeft, Pencil } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useTags } from "@/lib/api/hooks/product-tags";
import { useAuthStore } from "@/stores/auth.store";

import type { ReactNode } from "react";

const TagDetails = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const { data: tag, isLoading, isFetching } = useTags(businessId, id);

  if (isLoading || isFetching) {
    return (
      <Card>
        <Skeleton active paragraph={{ rows: 5 }} />
      </Card>
    );
  }

  if (!tag) {
    return (
      <Card>
        <Empty description="Tag not found" />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Product Tag Details"
        subtitle="View product tag information, status, and related product usage."
        breadcrumb={adminBreadcrumb}
      />

      <div className="flex items-center justify-between">
        <Button icon={<ArrowLeft />} onClick={() => router.back()}>
          Back
        </Button>

        <Button
          type="primary"
          icon={<Pencil />}
          onClick={() =>
            router.push(
              `/admin/dashboard/product-catalog/tags/update/${tag.id}`,
            )
          }
        >
          Edit
        </Button>
      </div>

      {/* Tag Details */}
      <Card>
        <div className="mb-6 flex items-center gap-3">
          <h2 className="m-0 text-2xl font-semibold">{tag.name}</h2>

          <Tag color={tag.status === "ACTIVE" ? "green" : "red"}>
            {tag.status}
          </Tag>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem label="Tag Name" value={tag.name} />

          <InfoItem label="Status" value={tag.status} />

          <InfoItem label="Featured" value={tag.isFeatured ? "Yes" : "No"} />

          <InfoItem label="Products" value={tag._count?.products ?? 0} />

          <InfoItem
            label="Created At"
            value={new Date(tag.createdAt).toLocaleDateString()}
          />

          <InfoItem
            label="Updated At"
            value={new Date(tag.updatedAt).toLocaleDateString()}
          />

          <InfoItem label="Tag ID" value={tag.id} />

          <InfoItem label="Business ID" value={tag.businessId} />

          <InfoItem label="Created By" value={tag.createdBy ?? "-"} />

          <InfoItem label="Updated By" value={tag.updatedBy ?? "-"} />
        </div>
      </Card>
    </div>
  );
};

export default TagDetails;

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
