"use client";

import {
  CirclePlus,
  Eye,
  Pencil,
  Trash2
} from "lucide-react";


import { Column, DataTable } from "@/components/shared/data-table";
import Loader from "@/components/shared/loader";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useProductsQuery } from "@/lib/api/hooks/product";
import {
  useProductVariantQuery,
  useVariantMutation,
} from "@/lib/api/hooks/product-variant";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import { ResponseVariant } from "@/types/product/variant";
import {
  App,
  Button,
  Card,
  Empty,
  Popconfirm,
  Select,
  Tag,
} from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { imageUrlSet } from "../products/_components/image-url";

const VariantManagement = () => {
  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const { message } = App.useApp();
  const router = useRouter();

  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const {
    data: products,
    isLoading,
    isFetching,
  } = useProductsQuery(businessId);

  const {
    data: variants,
    isLoading: variantLoading,
    isFetching: variantFetching,
  } = useProductVariantQuery(businessId, selectedProductId, search);

  const { removeVariant } = useVariantMutation(businessId);

  const productOptions = useMemo(() => {
    return (
      products?.items?.map((product) => ({
        label: product.name,
        value: product.id,
      })) ?? []
    );
  }, [products]);

  useEffect(() => {
    if (!products?.items?.length) return;

    setSelectedProductId((prev) => {
      if (prev) return prev;

      return products.items[0].id;
    });
  }, [products]);

  const selectedProduct = useMemo(() => {
    return products?.items?.find((product) => product.id === selectedProductId);
  }, [products, selectedProductId]);

  const handleProductChange = (productId: string) => {
    setSelectedProductId(productId);
    setSearch("");
  };

  const handleDelete = async (variantId: string) => {
    try {
      await removeVariant.mutateAsync({
        productId: selectedProductId,
        variantId,
      });

      message.success("Variant deleted successfully.");
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
  };

  const columns: Column<ResponseVariant>[] = [
    {
      key: "images",
      label: "Image",
      render: (row) => {
        const image = row.images?.[0];

        return image?.imageUrl ? (
          <Image
            src={imageUrlSet(image.imageUrl)}
            alt={image.altText || row.title}
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
      label: "Variant Title",
      type: "primary",
      render: (row) => (
        <div>
          <strong>{row.title}</strong>
          <p className="m-0 text-xs text-gray-500">{row.sku}</p>
        </div>
      ),
    },
    {
      key: "barcode",
      label: "Barcode",
      render: (row) => row.barcode || "-",
    },
    {
      key: "price",
      label: "Price",
      render: (row) => Number(row.priceOverride).toLocaleString(),
    },
    {
      key: "weight",
      label: "Weight",
      render: (row) => row.weight || "-",
    },
    {
      key: "attributes",
      label: "Attributes",
      render: (row) => row.attributes?.length ?? 0,
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
    {
      key: "createdAt",
      label: "Created At",
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button
            size="small"
            icon={<Eye />}
            onClick={() =>
              router.push(
                `/admin/dashboard/product-catalog/variant/details/${row.productId}/variant/${row.id}`
              )
            }
          />

          <Button
            size="small"
            icon={<Pencil />}
            onClick={() =>
              router.push(
                `/admin/dashboard/product-catalog/variant/update/${row.productId}/variants/${row.id}`
              )
            }
          />

          <Popconfirm
            title="Delete variant?"
            description="Are you sure you want to delete this variant?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(row.id)}
          >
            <Button danger size="small" icon={<Trash2 />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  if (isLoading || isFetching) {
    return <Loader />;
  }

  // if (!products?.items?.length) {
  //   return <Empty description="No products found" />;
  // }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Product Variants"
        subtitle="Manage product variants with SKU, barcode, price, weight, images, attributes, and status."
        breadcrumb={adminBreadcrumb}
      />

      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="w-full md:max-w-md">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Select Product
            </label>

            <Select
              value={selectedProductId || undefined}
              options={productOptions}
              onChange={handleProductChange}
              placeholder="Select product"
              showSearch
              optionFilterProp="label"
              className="w-full"
            />
          </div>

          <div>
            <Button
              type="primary"
              icon={<CirclePlus />}
              disabled={!selectedProductId}
              onClick={() => {
                router.push(
                  `/admin/dashboard/product-catalog/variant/create/${selectedProductId}`
                );
              }}
            >
              New Variant
            </Button>
          </div>
        </div>

        {selectedProduct ? (
          <p className="mb-0 mt-4 text-sm text-gray-500">
            Showing variants for{" "}
            <span className="font-medium text-gray-700">
              {selectedProduct.name}
            </span>
          </p>
        ) : null}
      </Card>

      <Card>
        <DataTable
          data={variants ?? []}
          columns={columns}
          onSearch={(value) => {
            setSearch(value);
          }}
          loading={variantLoading || variantFetching}
        />
      </Card>
    </div>
  );
};

export default VariantManagement;