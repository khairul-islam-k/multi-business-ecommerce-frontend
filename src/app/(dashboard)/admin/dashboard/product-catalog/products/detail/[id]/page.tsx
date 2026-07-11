"use client";

import {
  ArrowLeft,
  Pencil
} from "lucide-react";


import { Button, Card, Col, Empty, Row, Statistic, Tag } from "antd";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { ReactNode, useState } from "react";

import Loader from "@/components/shared/loader";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useProduct } from "@/lib/api/hooks/product";
import { useAuthStore } from "@/stores/auth.store";

import ViewVariantTable from "./_components/view-variant-table";

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
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const { data: product, isLoading, isFetching } = useProduct(businessId, id);

  if (isLoading || isFetching) {
    return <Loader />;
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

  const selectedImage =
    product.images?.find((image) => image.id === selectedImageId) ?? thumbnail;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Product Details"
        subtitle="View product information, variants, SKU, barcode, price, stock, category, brand, and status."
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
              `/admin/dashboard/product-catalog/products/edit/${product.id}`,
            )
          }
        >
          Edit
        </Button>
      </div>

      <Card>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
          {/* Images */}
          <div className="space-y-4">
            <div className="h-[320px] w-full overflow-hidden rounded-xl border bg-gray-50">
              {selectedImage?.imageUrl ? (
                <Image
                  src={imageUrlSet(selectedImage.imageUrl)}
                  alt={selectedImage.altText || product.name}
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
                {product.images.map((image) => {
                  const isSelected = selectedImage?.id === image.id;

                  return (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() => setSelectedImageId(image.id)}
                      className="relative h-20 overflow-hidden rounded-lg border bg-gray-50"
                      style={
                        isSelected
                          ? {
                              borderColor: "var(--dashboard-primary-color)",
                              boxShadow:
                                "0 0 0 2px var(--dashboard-focus-ring-color)",
                            }
                          : undefined
                      }
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
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

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
              <InfoItem
                label="Category"
                value={product.category?.name ?? "-"}
              />

              <InfoItem label="Brand" value={product.brand?.name ?? "-"} />

              <InfoItem label="Unit" value={product.unit?.name ?? "-"} />

              <InfoItem label="Images" value={product.images?.length ?? 0} />

              <InfoItem
                label="Variants"
                value={
                  Array.isArray(product.variants) ? product.variants.length : 0
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

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Total Quantity"
              value={Number(product?.stockSummary?.totalQuantity ?? 0)}
            />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Reserved Quantity"
              value={Number(product?.stockSummary?.quantityReserved ?? 0)}
            />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Available Quantity"
              value={Number(product?.stockSummary?.availableQuantity ?? 0)}
            />
          </Card>
        </Col>
      </Row>

      <Card title="System Information">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InfoItem label="Product Sku" value={product.sku} />
          <InfoItem label="Product slug" value={product.slug} />
        </div>
      </Card>

      <ViewVariantTable variants={product.variants ?? []} />
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
