"use client";

import { Button, Card, Empty, Skeleton, Tag } from "antd";
import { ArrowLeft, Pencil } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useBrand } from "@/lib/api/hooks/product-brand";
import { useAuthStore } from "@/stores/auth.store";

const imageUrlSet = (url: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;
  return `${baseUrl}${url}`;
};

const BrandDetails = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const { data: brand, isLoading, isFetching } = useBrand(businessId, id);

  if (isLoading || isFetching) {
    return (
      <Card>
        <Skeleton active paragraph={{ rows: 6 }} />
      </Card>
    );
  }

  if (!brand) {
    return (
      <Card>
        <Empty description="Brand not found" />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Product Brand Details"
        subtitle="View brand information, logo, status, sorting, and product usage."
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
              `/admin/dashboard/product-catalog/brands/update/${brand.id}`,
            )
          }
        >
          Edit
        </Button>
      </div>

      {/* Brand Details */}
      <Card>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr]">
          {/* Logo */}
          <div className="h-[220px] w-full overflow-hidden rounded-lg border bg-gray-50">
            {brand.logoUrl ? (
              <Image
                src={imageUrlSet(brand.logoUrl)}
                alt={brand.name}
                width={220}
                height={220}
                className="h-full w-full object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                No Logo
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="mb-3 flex items-center gap-3">
              <h2 className="m-0 text-2xl font-semibold">{brand.name}</h2>

              <Tag color={brand.status === "ACTIVE" ? "green" : "red"}>
                {brand.status}
              </Tag>
            </div>

            <p className="mb-5 text-gray-600">
              {brand.description || "No description available."}
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoItem label="Products" value={brand._count?.products ?? 0} />

              <InfoItem
                label="Created At"
                value={new Date(brand.createdAt).toLocaleDateString()}
              />

              <InfoItem
                label="Updated At"
                value={new Date(brand.updatedAt).toLocaleDateString()}
              />

              <InfoItem label="Brand ID" value={brand.id} />

              <InfoItem label="Business ID" value={brand.businessId} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BrandDetails;

type InfoItemProps = {
  label: string;
  value: React.ReactNode;
};

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="rounded-lg border bg-gray-50 p-4">
      <p className="mb-1 text-sm text-gray-500">{label}</p>
      <p className="m-0 break-all font-medium">{value}</p>
    </div>
  );
}
