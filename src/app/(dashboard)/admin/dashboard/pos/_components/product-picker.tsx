"use client";

import { Card, Empty, Input, List, Skeleton, Tag, theme, Typography } from "antd";
import Image from "next/image";
import { ResponseProduct } from "@/types/product/product";
import { imageUrlSet } from "../../product-catalog/products/_components/image-url";

const { Text } = Typography;

type ProductPickerProps = {
  products: ResponseProduct[];
  loading: boolean;
  search: string;
  selectedProductId?: string;
  onSearch: (value: string) => void;
  onSelect: (product: ResponseProduct) => void;
};

const money = (value?: string | number | null) =>
  `BDT ${Number(value ?? 0).toLocaleString()}`;

export function ProductPicker({
  products,
  loading,
  search,
  selectedProductId,
  onSearch,
  onSelect,
}: ProductPickerProps) {

  const { token } = theme.useToken();
  return (
    <Card
      title="Products"
      extra={
        <Input.Search
          allowClear
          placeholder="Search products"
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          style={{ width: 240 }}
        />
      }
    >
      {loading ? (
        <div className="space-y-3">
          <Skeleton active paragraph={{ rows: 2 }} />
          <Skeleton active paragraph={{ rows: 2 }} />
          <Skeleton active paragraph={{ rows: 2 }} />
        </div>
      ) : (
        <List
          dataSource={products}
          locale={{
            emptyText: <Empty description="No products found" />,
          }}
          renderItem={(product) => {
            const image = product.images?.[0];
            const isSelected = selectedProductId === product.id;
            const availableQuantity = Number(
              product.stockSummary?.availableQuantity ?? 0,
            );

            return (
              <List.Item
                className="cursor-pointer rounded-md transition-colors"
                style={{
                  border: isSelected
                    ? `1px solid ${token.colorPrimary}`
                    : `1px solid ${token.colorBorderSecondary}`,
                  background: isSelected
                    ? token.controlItemBgActive
                    : token.colorBgContainer,
                  paddingLeft: 10,
                  paddingRight: 10,
                }}
                onClick={() => onSelect(product)}
              >
                <List.Item.Meta
                  avatar={
                    image?.imageUrl ? (
                      <Image
                        src={imageUrlSet(image.imageUrl)}
                        alt={image.altText || product.name}
                        width={48}
                        height={48}
                        className="rounded-md object-cover"
                        unoptimized
                      />
                    ) : (
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-md text-xs"
                        style={{
                          background: token.colorFillSecondary,
                          color: token.colorTextTertiary,
                        }}
                      >
                        No image
                      </div>
                    )
                  }
                  title={
                    <div className="flex flex-wrap items-center gap-2">
                      <span style={{ color: token.colorText }}>
                        {product.name}
                      </span>

                      <Tag color={product.status === "ACTIVE" ? "green" : "default"}>
                        {product.status}
                      </Tag>
                    </div>
                  }
                  description={
                    <div className="space-y-1">
                      <Text type="secondary">
                        {product.category?.name ?? "Uncategorized"} ·{" "}
                        {product.brand?.name ?? "No brand"}
                      </Text>

                      <div
                        className="flex flex-wrap gap-2 text-xs"
                        style={{ color: token.colorTextTertiary }}
                      >
                        <span>{money(product.price)}</span>
                        <span>{product.variants?.length ?? 0} variants</span>
                        <span>{availableQuantity} available</span>
                      </div>
                    </div>
                  }
                />
              </List.Item>
            );
          }}
        />
      )}
    </Card>
  );
}
