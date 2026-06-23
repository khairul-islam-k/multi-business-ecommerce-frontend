"use client";

import { useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Descriptions,
  Empty,
  InputNumber,
  Select,
  Space,
  Spin,
  Tag,
  Typography,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useProductVariantOptionsQuery } from "@/lib/api/hooks/product-variant";
import { ResponseProduct } from "@/types/product/product";
import {
  ProductVariantAttributeInput,
  ProductVariantAvailableOption,
  ResponseVariant,
} from "@/types/product/variant";

const { Text } = Typography;

type Items = {
  product: Pick<ResponseProduct, "id" | "name" | "taxId">;
  variant: Pick<ResponseVariant, "id" | "title"> | null;
  quantity: number;
  discountAmount: number;
  unitPrice: number;
  availableQuantity?: number;
};

type VariantSelectorProps = {
  businessId: string;
  product?: ResponseProduct;
  onAdd: (item: Items) => void;
};

const toNumber = (value?: string | number | null) => Number(value ?? 0);

const getVariantPrice = (
  variant: ResponseVariant | null,
  product: ResponseProduct,
) =>
  toNumber(variant?.effectivePrice ?? variant?.priceOverride ?? product.price);

const getAvailableQuantity = (
  variant: ResponseVariant | null,
  product: ResponseProduct,
) => {
  if (variant?.stock) return Number(variant.stock.availableQuantity);
  if (product.stockSummary)
    return Number(product.stockSummary.availableQuantity);
  return undefined;
};

const selectedLabel = (
  option: ProductVariantAvailableOption,
  selectedAttributes: ProductVariantAttributeInput[],
) => {
  const selected = selectedAttributes.find(
    (item) => item.attributeId === option.attributeId,
  );
  if (!selected) return undefined;

  return option.values.find(
    (value) => value.attributeValueId === selected.attributeValueId,
  )?.value;
};

export function VariantSelector({
  businessId,
  product,
  onAdd,
}: VariantSelectorProps) {
  const [selectedAttributes, setSelectedAttributes] = useState<
    ProductVariantAttributeInput[]
  >([]);
  const [quantity, setQuantity] = useState(1);
  const [discountAmount, setDiscountAmount] = useState(0);

  const hasVariants = Boolean(product?.variants?.length);

  // when Emty [] selectedAttributes . it provide all available attribute
  const {
    data: variantOptions,
    isLoading,
    isFetching,
  } = useProductVariantOptionsQuery(
    businessId,
    product?.id ?? "",
    selectedAttributes,
  );

  const attributeOptions = useMemo(() => {
    if (variantOptions?.availableOptions?.length) {
      return variantOptions.availableOptions;
    }

    const map = new Map<string, ProductVariantAvailableOption>();

    product?.variants?.forEach((variant) => {
      variant.attributes?.forEach((item) => {
        const option = map.get(item.attributeId) ?? {
          attributeId: item.attributeId,
          name: item.attribute?.name ?? "Attribute",
          values: [],
        };

        if (
          !option.values.some(
            (value) => value.attributeValueId === item.attributeValueId,
          )
        ) {
          option.values.push({
            attributeValueId: item.attributeValueId,
            value: item.attributeValue?.value ?? "-",
            matchingVariantCount: 0,
            availableQuantity: 0,
            inStock: true,
            selected: false,
          });
        }

        map.set(item.attributeId, option);
      });
    });

    return Array.from(map.values());
  }, [product?.variants, variantOptions?.availableOptions]);

  const selectedVariant = variantOptions?.selectedVariant ?? null;
  const unitPrice = product ? getVariantPrice(selectedVariant, product) : 0;
  const availableQuantity = product
    ? getAvailableQuantity(selectedVariant, product)
    : undefined;
  const subtotal = unitPrice * quantity;
  const canAdd =
    Boolean(product) &&
    quantity > 0 &&
    discountAmount <= subtotal &&
    (!hasVariants || Boolean(selectedVariant));

  const handleAttributeChange = (
    attributeId: string,
    attributeValueId?: string,
  ) => {
    setSelectedAttributes((current) => {
      const next = current.filter((item) => item.attributeId !== attributeId);

      if (!attributeValueId) return next;

      return [...next, { attributeId, attributeValueId }];
    });
  };

  // const [cart, setCart] = useState<Items[]>([]);

  // handle the cart
  // const handleAddItem = (item: Items) => {
  //   setCart((currentCart) => {
  //     const existingItem = currentCart.find((cartItem) => {
  //       const sameProduct = cartItem.product.id === item.product.id;
  //       const sameVariant = cartItem.variant?.id === item.variant?.id;

  //       return sameProduct && sameVariant;
  //     });

  //     if (!existingItem) {
  //       return [...currentCart, item];
  //     }

  //     return currentCart.map((cartItem) => {
  //       const sameProduct = cartItem.product.id === item.product.id;
  //       const sameVariant = cartItem.variant?.id === item.variant?.id;

  //       if (!sameProduct || !sameVariant) {
  //         return cartItem;
  //       }

  //       return {
  //         ...cartItem,
  //         quantity: cartItem.quantity + item.quantity,
  //       };
  //     });
  //   });
  // };

  if (!product) {
    return (
      <Card title="Variant & Quantity">
        <Empty description="Select a product to configure the sale item" />
      </Card>
    );
  }

  return (
    <Card title="Variant & Quantity">
      <Space direction="vertical" size="middle" className="w-full">
        <div>
          <Text strong>{product.name}</Text>
          <div className="mt-1 text-sm text-gray-500">
            Base price BDT {toNumber(product.price).toLocaleString()}
          </div>
        </div>

        {hasVariants ? (
          <Spin spinning={isLoading || isFetching}>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {attributeOptions.map((option) => {
                const selectedValue = selectedAttributes.find(
                  (item) => item.attributeId === option.attributeId,
                )?.attributeValueId;
                const currentLabel = selectedLabel(option, selectedAttributes);
                const selectOptions = option.values.map((value) => ({
                  label: `${value.value} (${value.availableQuantity} available)`,
                  value: value.attributeValueId,
                  disabled: !value.inStock,
                }));

                if (
                  selectedValue &&
                  currentLabel &&
                  !selectOptions.some((item) => item.value === selectedValue)
                ) {
                  selectOptions.push({
                    label: currentLabel,
                    value: selectedValue,
                    disabled: false,
                  });
                }

                return (
                  <div key={option.attributeId}>
                    <Text type="secondary">{option.name}</Text>
                    <Select
                      allowClear
                      showSearch
                      className="mt-1 w-full"
                      placeholder={`Select ${option.name}`}
                      optionFilterProp="label"
                      value={selectedValue}
                      options={selectOptions}
                      onChange={(value) =>
                        handleAttributeChange(option.attributeId, value)
                      }
                    />
                  </div>
                );
              })}
            </div>
          </Spin>
        ) : (
          <Alert
            type="info"
            showIcon
            message="This product has no variants. It can be added directly."
          />
        )}

        {hasVariants && selectedAttributes.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {variantOptions?.selectedAttributes?.map((item) => (
              <Tag key={`${item.attributeId}-${item.attributeValueId}`}>
                {item.attributeName}: {item.attributeValue}
              </Tag>
            ))}
          </div>
        )}

        {hasVariants && !selectedVariant && (
          <Alert
            type="warning"
            showIcon
            message="Select a complete in-stock variant before adding this product."
          />
        )}

        <Descriptions size="small" column={1} bordered>
          <Descriptions.Item label="Selected item">
            {selectedVariant?.title ?? product.name}
          </Descriptions.Item>
          <Descriptions.Item label="Unit price">
            BDT {unitPrice.toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="Available">
            {availableQuantity ?? "Not reported"}
          </Descriptions.Item>
        </Descriptions>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <Text type="secondary">Quantity</Text>
            <InputNumber
              className="mt-1 w-full"
              min={1}
              max={availableQuantity}
              value={quantity}
              onChange={(value) => setQuantity(Number(value ?? 1))}
            />
          </div>

          <div>
            <Text type="secondary">Discount Amount</Text>
            <InputNumber
              className="mt-1 w-full"
              min={0}
              max={subtotal}
              value={discountAmount}
              onChange={(value) => setDiscountAmount(Number(value ?? 0))}
            />
          </div>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          disabled={!canAdd}
          onClick={() => {
            onAdd({
              product: { id: product.id, name: product.name, taxId: product.taxId },
              variant: selectedVariant
                ? {
                    id: selectedVariant.id,
                    title: selectedVariant.title,
                  }
                : null,
              quantity,
              discountAmount,
              unitPrice,
              availableQuantity,
            });
          }}
        >
          Add to Cart
        </Button>
      </Space>
    </Card>
  );
}
