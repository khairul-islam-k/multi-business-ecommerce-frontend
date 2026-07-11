"use client";

import {
  Button,
  Card,
  Empty,
  Input,
  Select,
  Skeleton,
  Space,
  Tag,
  theme,
  Typography,
} from "antd";
import { FilterX } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";

import { buildCategoryOptions } from "@/lib/product/category-options";
import { ResponseBrand } from "@/types/product/brands";
import {
  ResponseCategory,
  ResponseProduct,
  ResponseProductTag,
} from "@/types/product/product";

import { imageUrlSet } from "../../product-catalog/products/_components/image-url";

const { Text, Title } = Typography;

type ProductPickerProps = {
  products: ResponseProduct[];
  loading: boolean;
  search: string;
  requireWarehouse?: boolean;
  selectedWarehouseId?: string;
  selectedProductId?: string;
  categoryId?: string;
  brandId?: string;
  tagId?: string;
  categories?: ResponseCategory[];
  brands?: ResponseBrand[];
  tags?: ResponseProductTag[];
  onSearch: (value: string) => void;
  onCategoryChange?: (value?: string) => void;
  onBrandChange?: (value?: string) => void;
  onTagChange?: (value?: string) => void;
  onClearFilters?: () => void;
  onSelect: (product: ResponseProduct) => void;
};

type SelectOption = {
  label: string;
  value: string;
};

const money = (value?: string | number | null) =>
  `BDT ${Number(value ?? 0).toLocaleString()}`;

const getAvailableQuantity = (product: ResponseProduct) => {
  if (!product.stockSummary) return undefined;
  return Number(product.stockSummary.availableQuantity ?? 0);
};

export function ProductPicker({
  products,
  loading,
  search,
  requireWarehouse = false,
  selectedWarehouseId,
  selectedProductId,
  categoryId,
  brandId,
  tagId,
  categories = [],
  brands = [],
  tags = [],
  onSearch,
  onCategoryChange = () => undefined,
  onBrandChange = () => undefined,
  onTagChange = () => undefined,
  onClearFilters = () => undefined,
  onSelect,
}: ProductPickerProps) {
  const { token } = theme.useToken();
  const hasFilters = Boolean(search || categoryId || brandId || tagId);
  const warehouseReady = !requireWarehouse || Boolean(selectedWarehouseId);
  const categoryOptions: SelectOption[] = useMemo(() => {
    return buildCategoryOptions(categories ?? []);
  }, [categories]);

  return (
    <Card
      title="Products"
      extra={
        <Text type="secondary">
          {warehouseReady ? `${products.length} shown` : "Select warehouse"}
        </Text>
      }
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Input.Search
          allowClear
          placeholder="Search products"
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          style={{ width: 260 }}
          disabled={!warehouseReady}
        />

        <Select
          allowClear
          showSearch
          placeholder="Category"
          optionFilterProp="label"
          value={categoryId}
          style={{ width: 180 }}
          disabled={!warehouseReady}
          options={categoryOptions}
          onChange={onCategoryChange}
        />

        <Select
          allowClear
          showSearch
          placeholder="Brand"
          optionFilterProp="label"
          value={brandId}
          style={{ width: 180 }}
          disabled={!warehouseReady}
          options={brands.map((brand) => ({
            label: brand.name,
            value: brand.id,
          }))}
          onChange={onBrandChange}
        />

        <Select
          allowClear
          showSearch
          placeholder="Tag"
          optionFilterProp="label"
          value={tagId}
          style={{ width: 180 }}
          disabled={!warehouseReady}
          options={tags.map((tag) => ({
            label: tag.name,
            value: tag.id,
          }))}
          onChange={onTagChange}
        />

        <Button
          icon={<FilterX size={16} />}
          disabled={!hasFilters}
          onClick={onClearFilters}
        >
          Clear
        </Button>
      </div>

      {!warehouseReady ? (
        <Empty description="Select a warehouse to show available products" />
      ) : loading ? (
        <div className="space-y-3">
          <Skeleton active paragraph={{ rows: 2 }} />
          <Skeleton active paragraph={{ rows: 2 }} />
          <Skeleton active paragraph={{ rows: 2 }} />
        </div>
      ) : products.length === 0 ? (
        <Empty description="No products found" />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-3">
          {products.map((product) => {
            const image = product.images?.[0];
            const availableQuantity = getAvailableQuantity(product);
            const hasVariants = Boolean(product.variants?.length);
            const outOfStock =
              availableQuantity !== undefined && availableQuantity <= 0;
            const isSelected = selectedProductId === product.id;

            return (
              <button
                key={product.id}
                type="button"
                disabled={outOfStock}
                className="group min-w-0 overflow-hidden rounded-md border text-left transition disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  borderColor: isSelected
                    ? token.colorPrimary
                    : token.colorBorderSecondary,
                  background: isSelected
                    ? token.controlItemBgActive
                    : token.colorBgContainer,
                }}
                onClick={() => onSelect(product)}
              >
                <div
                  className="relative aspect-[4/3] overflow-hidden"
                  style={{ background: token.colorFillTertiary }}
                >
                  {image?.imageUrl ? (
                    <Image
                      src={imageUrlSet(image.imageUrl)}
                      alt={image.altText || product.name}
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
                    {hasVariants && <Tag color="blue">Variants</Tag>}
                  </div>
                </div>

                <div className="space-y-2 p-3">
                  <div className="min-w-0">
                    <Title level={5} ellipsis={{ rows: 2 }} className="m-0">
                      {product.name}
                    </Title>
                    <Text type="secondary" className="block" ellipsis>
                      {product.category?.name ?? "Uncategorized"} /{" "}
                      {product.brand?.name ?? "No brand"}
                    </Text>
                  </div>

                  <Space size={6} wrap>
                    <Tag>{money(product.price)}</Tag>
                    {product.tags?.slice(0, 2).map((item) => (
                      <Tag key={item.id}>{item.tag.name}</Tag>
                    ))}
                  </Space>

                  <Text type="secondary" className="block text-xs">
                    {hasVariants
                      ? "Click to choose a variant"
                      : "Click to add to cart"}
                  </Text>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </Card>
  );
}
