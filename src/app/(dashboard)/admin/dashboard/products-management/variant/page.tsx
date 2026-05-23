"use client";

import { useProductsQuery } from "@/lib/api/hooks/product";
import { useAuthStore } from "@/stores/auth.store";
import { Empty, Skeleton, Tabs, type TabsProps } from "antd";
import { useMemo, useState } from "react";

const VariantManagement = () => {
  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const {
    data: products,
    isLoading,
    isFetching,
  } = useProductsQuery(businessId);

  const [selectedProductId, setSelectedProductId] = useState<string>("");

  const items: TabsProps["items"] = useMemo(() => {
    return (
      products?.items?.map((product) => ({
        key: product.id, // ✅ this is product id
        label: product.name, // ✅ show product name
        children: (
          <div>
            <h3>{product.name}</h3>
            <p>Product ID: {product.id}</p>

            {/* here you can pass product id */}
            {/* <VariantList productId={product.id} /> */}
          </div>
        ),
      })) ?? []
    );
  }, [products]);

  const onChange = (productId: string) => {
    console.log("Selected product id:", productId);

    setSelectedProductId(productId);
  };

  if (isLoading || isFetching) {
    return <Skeleton active paragraph={{ rows: 4 }} />;
  }

  if (!products?.items?.length) {
    return <Empty description="No products found" />;
  }

  return (
    <div>
      <Tabs
        defaultActiveKey={products.items[0]?.id}
        items={items}
        onChange={onChange}
      />

      <div style={{ marginTop: 16 }}>
        Selected Product ID: <strong>{selectedProductId || products.items[0]?.id}</strong>
      </div>
    </div>
  );
};

export default VariantManagement;