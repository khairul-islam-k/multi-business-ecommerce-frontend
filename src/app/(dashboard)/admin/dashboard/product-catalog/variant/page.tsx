"use client";

import { useProductsQuery } from "@/lib/api/hooks/product";
import { useProductVariantQuery, useVariantMutation } from "@/lib/api/hooks/product-variant";
import { useAuthStore } from "@/stores/auth.store";
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { App, Button, Empty, Popconfirm, Select, Skeleton, Tabs, Tag, type TabsProps } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { imageUrlSet } from "../products/_components/image-url";
import { Column, DataTable } from "@/components/shared/data-table";
import { ResponseVariant } from "@/types/product/variant";
import { getApiErrorMessage } from "@/lib/axios";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

type ProductStatusFilter = "DRAFT" | "ACTIVE" | "INACTIVE" | "ARCHIVED";

const VariantManagement = () => {
  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";
  const { message } = App.useApp();

  const router = useRouter();

  const [statusFilter, setStatusFilter] = useState<
    ProductStatusFilter | undefined
  >(undefined);

  const [selectedProductId, setSelectedProductId] = useState<string>("");

  const {
    data: products,
    isLoading,
    isFetching,
  } = useProductsQuery(businessId);

  // variants
  const [search, setSearch] = useState<string>('');

  const { data: variants, isLoading: variantLoading, isFetching: variantFetching } = useProductVariantQuery(businessId, selectedProductId, search);

  const { removeVariant } = useVariantMutation(businessId);

  const handleDelete = async (variantId: string) => {
    try {
      await removeVariant.mutateAsync({
        productId: selectedProductId,
        variantId
      })
      message.success('Variant has been deleted');
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
  }

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
      render: (row) => Number(row.price).toLocaleString(),
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
            icon={<EyeOutlined />}
            onClick={() =>
              router.push(
                `/admin/dashboard/product-catalog/variant/details/${row.productId}/variant/${row.id}`
              )
            }
          />

          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() =>
              router.push(
                `/admin/dashboard/product-catalog/variant/update/${row.productId}/variants/${row.id}`
              )
            }
          />

          <Popconfirm
            title="Delete variant?"
            description="Are you sure?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(row.id)}
          >
            <Button danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  // ✅ set first product id as initial value
  useEffect(() => {
    if (!products?.items?.length) return;
    const handleSetId = () => {
      setSelectedProductId((prev) => prev || products.items[0].id);
    }

    handleSetId()
  }, [products]);

  const items: TabsProps["items"] = useMemo(() => {
    return (
      products?.items?.map((product) => ({
        key: product.id,
        label: product.name,
      })) ?? []
    );
  }, [products]);

  const onChange = (productId: string) => {
    setSelectedProductId(productId);
  };

  if (isLoading || isFetching) {
    return <Skeleton active paragraph={{ rows: 4 }} />;
  }

  if (!products?.items?.length) {
    return <Empty description="No products found" />;
  }

  return (
    <div className="space-y-6">

      <PageHeader
        title="Product Variants"
        subtitle="Manage product variants with SKU, barcode, price, weight, images, attributes, and status."
        breadcrumb={adminBreadcrumb}
      />

      <Tabs activeKey={selectedProductId} items={items} onChange={onChange} />

      <DataTable
        data={variants ?? []}
        toolbarEnd={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            disabled={!selectedProductId}
            onClick={() => {
              if (selectedProductId) {
                router.push(
                  `/admin/dashboard/product-catalog/variant/create/${selectedProductId}`
                )
              }
            }
            }
          >
            New Variant
          </Button>
        }
        columns={columns}
        onSearch={(value) => {
          setSearch(value);
        }}
        loading={
          variantLoading ||
          variantFetching
        }
      />
    </div>
  );
};

export default VariantManagement;