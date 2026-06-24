import { Card, Tag } from "antd";
import Image from "next/image";

import { Column, DataTable } from "@/components/shared/data-table";
import { ResponseVariant } from "@/types/product/variant";

import { imageUrlSet } from "../../../_components/image-url";

type VariantProps = {
  variants: ResponseVariant[];
};

const formatPrice = (value?: string) => {
  if (!value) return "-";
  return Number(value).toLocaleString();
};

const ViewVariantTable = ({ variants }: VariantProps) => {
  const columns: Column<ResponseVariant>[] = [
    {
      key: "images",
      label: "Image",
      render: (row) => {
        const firstImage = row.images?.[0];

        return firstImage?.imageUrl ? (
          <Image
            src={imageUrlSet(firstImage.imageUrl)}
            alt={firstImage.altText ?? row.title}
            width={48}
            height={48}
            className="rounded-md object-cover"
            unoptimized
          />
        ) : (
          "-"
        );
      },
    },
    {
      key: "title",
      label: "Variant",
      type: "primary",
      render: (row) => <strong>{row.title}</strong>,
    },
    {
      key: "sku",
      label: "SKU",
      render: (row) => row.sku ?? "-",
    },
    {
      key: "barcode",
      label: "Barcode",
      render: (row) => row.barcode ?? "-",
    },
    {
      key: "attributes",
      label: "Attributes",
      render: (row) =>
        row.attributes?.length ? (
          <div className="flex flex-wrap gap-1">
            {row.attributes.map((item) => (
              <Tag key={item.id}>
                {item.attribute?.name}: {item.attributeValue?.value}
              </Tag>
            ))}
          </div>
        ) : (
          "-"
        ),
    },
    {
      key: "priceOverride",
      label: "Price",
      render: (row) => formatPrice(row.priceOverride),
    },
    {
      key: "weight",
      label: "Weight",
      render: (row) => row.weight ?? "-",
    },
    {
      key: "status",
      label: "Status",
      type: "meta",
      render: (row) => (
        <Tag color={row.status === "ACTIVE" ? "green" : "red"}>
          {row.status}
        </Tag>
      ),
    },
  ];

  return (
    <Card title="Product Variants">
      <DataTable isSearch={false} data={variants ?? []} columns={columns} />
    </Card>
  );
};

export default ViewVariantTable;
