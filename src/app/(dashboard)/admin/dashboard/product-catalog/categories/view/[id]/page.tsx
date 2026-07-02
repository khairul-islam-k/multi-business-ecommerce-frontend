"use client";

import { Button, Card, Empty, Skeleton, Tag } from "antd";
import { ArrowLeft } from "lucide-react";
import NextImage from "next/image";
import { useParams, useRouter } from "next/navigation";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useCategory } from "@/lib/api/hooks/product-categories";
import { useAuthStore } from "@/stores/auth.store";

import type { ReactNode } from "react";

const imageUrlSet = (url: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;
  return `${baseUrl}${url}`;
};

const ViewCategoryDetails = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ? business?.id : "";

  const { data: category, isLoading, isFetching } = useCategory(businessId, id);

  if (isLoading || isFetching) {
    return (
      <Card>
        <Skeleton active paragraph={{ rows: 6 }} />
      </Card>
    );
  }

  if (!category) {
    return (
      <Card>
        <Empty description="Category not found" />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Product Details"
        subtitle="View product information, images, category, brand, unit, tags, status, and system details."
        breadcrumb={adminBreadcrumb}
      />
      <div className="flex items-center justify-between">
        <Button icon={<ArrowLeft />} onClick={() => router.back()}>
          Back
        </Button>
      </div>

      {/* Category Details */}
      <Card>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr]">
          {/* Image */}
          <div className="h-[220px] w-full overflow-hidden rounded-lg border bg-gray-50">
            {category.imageUrl ? (
              <NextImage
                src={imageUrlSet(category.imageUrl)}
                alt={category.name}
                width={220}
                height={220}
                className="h-full w-full object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="mb-3 flex items-center gap-3">
              <h2 className="m-0 text-2xl font-semibold">{category.name}</h2>

              <Tag color={category.status === "ACTIVE" ? "green" : "red"}>
                {category.status}
              </Tag>
            </div>

            <p className="mb-5 text-gray-600">
              {category.description || "No description available."}
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoItem
                label="Children"
                value={category._count?.children ?? 0}
              />

              <InfoItem
                label="Products"
                value={category._count?.products ?? 0}
              />

              <InfoItem
                label="Created At"
                value={new Date(category.createdAt).toLocaleDateString()}
              />

              <InfoItem
                label="Updated At"
                value={new Date(category.updatedAt).toLocaleDateString()}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Children Categories */}
      <Card title="Children Categories">
        {category.children?.length ? (
          <div className="space-y-3">
            {category.children.map((child) => (
              <div
                key={child.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <h4 className="m-0 font-medium">{child.name}</h4>
                </div>

                <div className="flex items-center gap-2">
                  <Tag color={child.status === "ACTIVE" ? "green" : "red"}>
                    {child.status}
                  </Tag>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty description="No children categories" />
        )}
      </Card>
    </div>
  );
};

export default ViewCategoryDetails;

type InfoItemProps = {
  label: string;
  value: ReactNode;
};

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="rounded-lg border bg-gray-50 p-4">
      <p className="mb-1 text-sm text-gray-500">{label}</p>
      <p className="m-0 font-medium">{value}</p>
    </div>
  );
}
