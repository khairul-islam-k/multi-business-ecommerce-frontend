"use client";

import { Empty, Modal, Tag, theme, Typography } from "antd";
import Image from "next/image";

import { ResponseProduct } from "@/types/product/product";
import { ResponseVariant } from "@/types/product/variant";

import { imageUrlSet } from "../../product-catalog/products/_components/image-url";
import { PosCartItem } from "./types";

const { Text, Title } = Typography;

type VariantSelectorProps = {
  open: boolean;
  product?: ResponseProduct;
  onClose: () => void;
  onAdd: (item: Omit<PosCartItem, "id">) => void;
};

const toNumber = (value?: string | number | null) => Number(value ?? 0);

const money = (value?: string | number | null) =>
  `BDT ${toNumber(value).toLocaleString()}`;

const getVariantPrice = (variant: ResponseVariant, product: ResponseProduct) =>
  toNumber(variant.effectivePrice ?? variant.priceOverride ?? product.price);

const getAvailableQuantity = (variant: ResponseVariant) => {
  if (!variant.stock) return undefined;
  return Number(variant.stock.availableQuantity ?? 0);
};

export function VariantSelector({
  open,
  product,
  onClose,
  onAdd,
}: VariantSelectorProps) {
  const { token } = theme.useToken();
  const variants = product?.variants ?? [];

  return (
    <Modal
      title={product ? `Select variant - ${product.name}` : "Select variant"}
      open={open}
      centered
      width={840}
      footer={null}
      onCancel={onClose}
    >
      {variants.length === 0 ? (
        <Empty description="No variants found for this product" />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {variants.map((variant) => {
            const image = variant.images?.[0] ?? product?.images?.[0];
            const availableQuantity = getAvailableQuantity(variant);
            const outOfStock =
              availableQuantity !== undefined && availableQuantity <= 0;
            const inactive = variant.status !== "ACTIVE";
            const disabled = outOfStock || inactive || !product;
            const unitPrice = product ? getVariantPrice(variant, product) : 0;

            return (
              <button
                key={variant.id}
                type="button"
                disabled={disabled}
                className="group min-w-0 overflow-hidden rounded-md border text-left transition disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  borderColor: token.colorBorderSecondary,
                  background: token.colorBgContainer,
                }}
                onClick={() => {
                  if (!product) return;

                  onAdd({
                    product: {
                      id: product.id,
                      name: product.name,
                      taxId: product.taxId,
                    },
                    variant: {
                      id: variant.id,
                      title: variant.title,
                    },
                    quantity: 1,
                    discountAmount: 0,
                    unitPrice,
                    availableQuantity,
                  });
                  onClose();
                }}
              >
                <div
                  className="relative aspect-[4/3] overflow-hidden"
                  style={{ background: token.colorFillTertiary }}
                >
                  {image?.imageUrl ? (
                    <Image
                      src={imageUrlSet(image.imageUrl)}
                      alt={image.altText || variant.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition group-hover:scale-[1.02]"
                      unoptimized
                    />
                  ) : (
                    <div
                      className="flex h-full w-full items-center justify-center text-xs"
                      style={{ color: token.colorTextTertiary }}
                    >
                      No image
                    </div>
                  )}

                  <div className="absolute left-2 top-2 flex flex-wrap gap-1">
                    <Tag color={outOfStock ? "red" : "green"}>
                      {outOfStock
                        ? "Out of stock"
                        : `${availableQuantity ?? "Stock"} available`}
                    </Tag>
                    {inactive && <Tag color="default">Inactive</Tag>}
                  </div>
                </div>

                <div className="space-y-2 p-3">
                  <Title level={5} ellipsis={{ rows: 2 }} className="m-0">
                    {variant.title}
                  </Title>
                  <Text strong>{money(unitPrice)}</Text>

                  <div className="flex flex-wrap gap-1">
                    {variant.attributes?.length ? (
                      variant.attributes.map((attribute) => (
                        <Tag key={attribute.id}>
                          {attribute.attribute?.name}:{" "}
                          {attribute.attributeValue?.value}
                        </Tag>
                      ))
                    ) : (
                      <Tag>No attributes</Tag>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </Modal>
  );
}
