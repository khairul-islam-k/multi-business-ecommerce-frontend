"use client";

import { useProduct } from "@/lib/api/hooks/product";
import { useAuthStore } from "@/stores/auth.store";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Card, Empty, Skeleton, Tag } from "antd";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import type { ReactNode } from "react";

const imageUrlSet = (url?: string | null) => {
  if (!url) return "";

  if (url.startsWith("http")) {
    return url;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;
  return `${baseUrl}${url}`;
};

const getProductStatusColor = (status: string) => {
  if (status === "ACTIVE") return "green";
  if (status === "DRAFT") return "blue";
  if (status === "INACTIVE") return "red";
  if (status === "ARCHIVED") return "default";

  return "default";
};

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const {
    data: product,
    isLoading,
    isFetching,
  } = useProduct(businessId, id);

  if (isLoading || isFetching) {
    return (
      <Card>
        <Skeleton active paragraph={{ rows: 8 }} />
      </Card>
    );
  }

  if (!product) {
    return (
      <Card>
        <Empty description="Product not found" />
      </Card>
    );
  }

  const thumbnail =
    product.images?.find((image) => image.isThumbnail) ?? product.images?.[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
          Back
        </Button>

        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() =>
            router.push(
              `/admin/dashboard/products-management/products/edit/${product.id}`
            )
          }
        >
          Edit
        </Button>
      </div>

      {/* Main Product Info */}
      <Card>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="h-[320px] w-full overflow-hidden rounded-xl border bg-gray-50">
              {thumbnail?.imageUrl ? (
                <Image
                  src={imageUrlSet(thumbnail.imageUrl)}
                  alt={thumbnail.altText || product.name}
                  width={320}
                  height={320}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>

            {product.images?.length ? (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image) => (
                  <div
                    key={image.id}
                    className="relative h-20 overflow-hidden rounded-lg border bg-gray-50"
                  >
                    <Image
                      src={imageUrlSet(image.imageUrl)}
                      alt={image.altText || product.name}
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                      unoptimized
                    />

                    {image.isThumbnail ? (
                      <span className="absolute left-1 top-1 rounded bg-black/70 px-2 py-0.5 text-[10px] text-white">
                        Main
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {/* Product Details */}
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <h1 className="m-0 text-2xl font-semibold">{product.name}</h1>

              <Tag color={getProductStatusColor(product.status)}>
                {product.status}
              </Tag>
            </div>

            <p className="mb-1 text-sm text-gray-500">Slug: {product.slug}</p>

            <p className="mb-6 text-gray-600">
              {product.description || "No description available."}
            </p>

            <div className="mb-6 flex flex-wrap gap-2">
              {product.tags?.length ? (
                product.tags.map((item) => (
                  <Tag key={item.id}>{item.tag?.name}</Tag>
                ))
              ) : (
                <Tag>No Tags</Tag>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoItem label="Category" value={product.category?.name ?? "-"} />

              <InfoItem label="Brand" value={product.brand?.name ?? "-"} />

              <InfoItem label="Unit" value={product.unit?.name ?? "-"} />

              <InfoItem
                label="Images"
                value={product.images?.length ?? 0}
              />

              <InfoItem
                label="Variants"
                value={
                  Array.isArray(product.variants)
                    ? product.variants.length
                    : 0
                }
              />

              <InfoItem
                label="Attributes"
                value={
                  Array.isArray(product.attributes)
                    ? product.attributes.length
                    : 0
                }
              />

              <InfoItem
                label="Created At"
                value={new Date(product.createdAt).toLocaleDateString()}
              />

              <InfoItem
                label="Updated At"
                value={new Date(product.updatedAt).toLocaleDateString()}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* IDs */}
      <Card title="System Information">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InfoItem label="Product ID" value={product.id} />
          <InfoItem label="Business ID" value={product.businessId} />
          <InfoItem label="Category ID" value={product.categoryId} />
          <InfoItem label="Brand ID" value={product.brandId} />
          <InfoItem label="Unit ID" value={product.unitId} />
          <InfoItem label="Created By" value={product.createdBy ?? "-"} />
          <InfoItem label="Updated By" value={product.updatedBy ?? "-"} />
        </div>
      </Card>
    </div>
  );
}

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