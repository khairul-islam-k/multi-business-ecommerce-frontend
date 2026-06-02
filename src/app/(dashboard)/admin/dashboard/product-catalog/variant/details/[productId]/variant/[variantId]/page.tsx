"use client";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useVariant } from "@/lib/api/hooks/product-variant";
import { useAuthStore } from "@/stores/auth.store";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Card, Empty, Skeleton, Tag } from "antd";
import JsBarcode from "jsbarcode";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

const imageUrlSet = (url?: string | null) => {
  if (!url) return "";

  if (url.startsWith("http")) {
    return url;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;
  return `${baseUrl}${url}`;
};

const getStatusColor = (status: string) => {
  if (status === "ACTIVE") return "green";
  if (status === "INACTIVE") return "red";

  return "default";
};

const VariantDetail = () => {
  const router = useRouter();

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const { productId, variantId } = useParams<{
    productId: string;
    variantId: string;
  }>();

  const {
    data: variant,
    isLoading,
    isFetching,
  } = useVariant(businessId, productId, variantId);

  if (isLoading || isFetching) {
    return (
      <Card>
        <Skeleton active paragraph={{ rows: 8 }} />
      </Card>
    );
  }

  if (!variant) {
    return (
      <Card>
        <Empty description="Variant not found" />
      </Card>
    );
  }

  const thumbnail =
    variant.images?.find((image) => image.isThumbnail) ?? variant.images?.[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Product Variant Details"
        subtitle="View variant information, SKU, barcode, price, weight, images, attributes, and status."
        breadcrumb={adminBreadcrumb}
      />

      <div className="flex items-center justify-between">
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
          Back
        </Button>

        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() =>
            router.push(
              `/admin/dashboard/product-catalog/variant/update/${productId}/variants/${variantId}`
            )
          }
        >
          Edit Variant
        </Button>
      </div>

      <Card>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
          <div className="space-y-4">
            <div className="h-[320px] w-full overflow-hidden rounded-xl border bg-gray-50">
              {thumbnail?.imageUrl ? (
                <Image
                  src={imageUrlSet(thumbnail.imageUrl)}
                  alt={thumbnail.altText || variant.title}
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

            {variant.images?.length ? (
              <div className="grid grid-cols-4 gap-3">
                {variant.images.map((image) => (
                  <div
                    key={image.id}
                    className="relative h-20 overflow-hidden rounded-lg border bg-gray-50"
                  >
                    <Image
                      src={imageUrlSet(image.imageUrl)}
                      alt={image.altText || variant.title}
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

          <div>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <h1 className="m-0 text-2xl font-semibold">{variant.title}</h1>

              <Tag color={getStatusColor(variant.status)}>
                {variant.status}
              </Tag>
            </div>

            <p className="mb-6 text-sm text-gray-500">
              Variant ID: {variant.id}
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoItem label="SKU" value={variant.sku || "-"} />

              <BarcodeInfoItem value={variant.barcode || ""} />

              <InfoItem
                label="Price"
                value={Number(variant.price).toLocaleString()}
              />

              <InfoItem label="Weight" value={variant.weight || "-"} />

              <InfoItem label="Images" value={variant.images?.length ?? 0} />

              <InfoItem
                label="Attributes"
                value={variant.attributes?.length ?? 0}
              />

              <InfoItem
                label="Created At"
                value={new Date(variant.createdAt).toLocaleDateString()}
              />

              <InfoItem
                label="Updated At"
                value={new Date(variant.updatedAt).toLocaleDateString()}
              />
            </div>
          </div>
        </div>
      </Card>

      <Card title="Variant Attributes">
        {variant.attributes?.length ? (
          <div className="space-y-3">
            {variant.attributes.map((a) => (
              <div
                key={a.id}
                className="grid grid-cols-1 gap-3 rounded-lg border p-4 md:grid-cols-2"
              >
                <InfoItem label="Attribute" value={a.attribute?.name ?? "-"} />

                <InfoItem
                  label="Attribute Value"
                  value={a.attributeValue?.value ?? "-"}
                />
              </div>
            ))}
          </div>
        ) : (
          <Empty description="No attributes found" />
        )}
      </Card>

      <Card title="System Information">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InfoItem label="Product" value={variant.product?.name ?? "-"} />
          <InfoItem label="Product ID" value={variant.productId} />
          <InfoItem label="Variant ID" value={variant.id} />
          <InfoItem label="Business ID" value={variant.businessId} />
        </div>
      </Card>
    </div>
  );
};

export default VariantDetail;

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

function BarcodeInfoItem({ value }: { value: string }) {
  return (
    <div className="rounded-lg border bg-gray-50 p-4 sm:col-span-2">
      <p className="mb-2 text-sm text-gray-500">Barcode</p>

      {value ? (
        <div className="rounded-md border bg-white p-3">
          <Barcode value={value} />

          <p className="m-0 mt-2 break-all text-center text-sm font-medium">
            {value}
          </p>
        </div>
      ) : (
        <p className="m-0 font-medium">-</p>
      )}
    </div>
  );
}

function Barcode({ value }: { value: string }) {
  const barcodeRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!barcodeRef.current || !value) return;

    JsBarcode(barcodeRef.current, value, {
      format: "CODE128",
      width: 2,
      height: 72,
      displayValue: false,
      margin: 8,
    });
  }, [value]);

  return (
    <div className="w-full overflow-x-auto">
      <svg ref={barcodeRef} className="mx-auto max-w-full" />
    </div>
  );
}