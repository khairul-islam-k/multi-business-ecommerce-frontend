"use client";

import { App, Card, Pagination, Select, Typography } from "antd";
import { useMemo, useState } from "react";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useCustomerQuery } from "@/lib/api";
import { useFinanceAccountQuery } from "@/lib/api/hooks/finance-account";
import { usePosSaleMutation } from "@/lib/api/hooks/pos";
import { useProductsQuery } from "@/lib/api/hooks/product";
import { useProductBrandQuery } from "@/lib/api/hooks/product-brand";
import { useProductCategoriesQuery } from "@/lib/api/hooks/product-categories";
import { useProductTagQuery } from "@/lib/api/hooks/product-tags";
import { useTaxQuery } from "@/lib/api/hooks/tax";
import { useWarehousesQuery } from "@/lib/api/hooks/warehouse";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import { CreatePosSalePayload, PosPaymentMethod } from "@/types/pos";
import { ResponseProduct } from "@/types/product/product";

import { PosCart } from "./_components/pos-cart";
import { ProductPicker } from "./_components/product-picker";
import { PosCartItem, PosCheckoutValues } from "./_components/types";
import { VariantSelector } from "./_components/variant-selector";

const { Text } = Typography;

const PAGE_LIMIT = 12;

const createCartId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;

const trimOrUndefined = (value?: string) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

const toNumber = (value?: string | number | null) => Number(value ?? 0);

const getProductAvailableQuantity = (product: ResponseProduct) => {
  if (!product.stockSummary) return undefined;
  return Number(product.stockSummary.availableQuantity ?? 0);
};

const PosOrder = () => {
  const { message } = App.useApp();
  const business = useAuthStore((state) => state.selectedBusiness);
  const businessId = business?.id ?? "";
  const addToCard = useAuthStore((s) => s.addCartItem);
  const cartPos = useAuthStore((s) => s.cartPos);
  const removeCartItem = useAuthStore((s) => s.removeCartItem);
  const updateCartItem = useAuthStore((s) => s.updateCartItem);
  const resetCard = useAuthStore((s) => s.clearCart);

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<string>();
  const [brandId, setBrandId] = useState<string>();
  const [tagId, setTagId] = useState<string>();
  const [variantProduct, setVariantProduct] = useState<ResponseProduct>();
  const [checkoutValues, setCheckoutValues] = useState<PosCheckoutValues>({
    customerMode: "walk-in",
  });

  const selectedWarehouseId = checkoutValues.warehouseId;

  const {
    data: products,
    isLoading: productsLoading,
    isFetching: productsFetching,
  } = useProductsQuery(
    businessId,
    {
      page: currentPage,
      limit: PAGE_LIMIT,
      search,
      status: "ACTIVE",
      warehouseId: selectedWarehouseId,
      categoryId,
      brandId,
      tagId,
      sortOrder: "desc",
    },
    { enabled: Boolean(selectedWarehouseId) },
  );

  const { data: taxes, isLoading: taxesLoading } = useTaxQuery(businessId, {
    status: "ACTIVE",
  });

  const { data: warehouses, isLoading: warehousesLoading } = useWarehousesQuery(
    businessId,
    {
      status: "ACTIVE",
    },
  );

  const { data: categories, isLoading: categoriesLoading } =
    useProductCategoriesQuery(businessId, {
      page: 1,
      limit: 100,
      status: "ACTIVE",
      sortBy: "name",
      sortOrder: "asc",
    });

  const { data: brands, isLoading: brandsLoading } = useProductBrandQuery(
    businessId,
    {
      page: 1,
      limit: 100,
      status: "ACTIVE",
      sortBy: "name",
      sortOrder: "asc",
    },
  );

  const { data: tags, isLoading: tagsLoading } = useProductTagQuery(
    businessId,
    {
      page: 1,
      limit: 100,
      status: "ACTIVE",
      sortBy: "name",
      sortOrder: "asc",
    },
  );

  const { data: accounts, isLoading: accountsLoading } = useFinanceAccountQuery(
    businessId,
    {
      status: "ACTIVE",
    },
  );
  const { data: customers, isLoading: customersLoading } = useCustomerQuery(
    businessId,
    {
      page: 1,
      limit: 100,
      status: "ACTIVE",
    },
  );

  const createPosSale = usePosSaleMutation(businessId);

  const productItems = useMemo(() => products?.items ?? [], [products?.items]);
  const taxItems = taxes?.items ?? [];
  const warehouseItems = warehouses?.items ?? [];
  const accountItems = accounts?.items ?? [];
  const customerItems = customers?.items ?? [];
  const categoryItems = categories?.items || [];
  const brandItems = brands?.items ?? [];
  const tagItems = tags?.items ?? [];
  const totalProducts = products?.meta?.total ?? 0;

  const handleAddItem = (item: Omit<PosCartItem, "id">) => {
    const existingItem = cartPos.find((cartItem) => {
      const sameProduct = cartItem.product.id === item.product.id;
      const sameVariant = cartItem.variant?.id === item.variant?.id;

      return sameProduct && sameVariant;
    });
    const nextQuantity = (existingItem?.quantity ?? 0) + item.quantity;

    if (
      item.availableQuantity !== undefined &&
      nextQuantity > item.availableQuantity
    ) {
      message.warning("Requested quantity exceeds available stock.");
      return;
    }

    addToCard({
      ...item,
      id: createCartId(),
    });
  };

  const handleWarehouseChange = (warehouseId?: string) => {
    if (warehouseId !== selectedWarehouseId && cartPos.length > 0) {
      resetCard();
      message.info("Cart cleared because the warehouse changed.");
    }

    setCheckoutValues((current) => ({ ...current, warehouseId }));
    setCurrentPage(1);
    setVariantProduct(undefined);
  };

  const resetProductFilters = () => {
    setSearch("");
    setCategoryId(undefined);
    setBrandId(undefined);
    setTagId(undefined);
    setCurrentPage(1);
  };

  const handleProductSelect = (product: ResponseProduct) => {
    if (!selectedWarehouseId) {
      message.error("Select a warehouse first.");
      return;
    }

    const availableQuantity = getProductAvailableQuantity(product);

    if (availableQuantity !== undefined && availableQuantity <= 0) {
      message.warning(
        "This product is out of stock in the selected warehouse.",
      );
      return;
    }

    if (product.variants?.length) {
      setVariantProduct(product);
      return;
    }

    handleAddItem({
      product: { id: product.id, name: product.name, taxId: product.taxId },
      variant: null,
      quantity: 1,
      discountAmount: 0,
      unitPrice: toNumber(product.price),
      availableQuantity,
    });
  };

  const handleCheckout = async () => {
    if (
      !checkoutValues.warehouseId ||
      !checkoutValues.paymentMethod ||
      !checkoutValues.financeAccountId ||
      cartPos.length === 0
    ) {
      message.error("Complete the required checkout fields first.");
      return;
    }

    const customerMode = checkoutValues.customerMode ?? "walk-in";

    if (customerMode === "existing" && !checkoutValues.customerId) {
      message.error("Select an existing customer first.");
      return;
    }

    const payload: CreatePosSalePayload = {
      warehouseId: checkoutValues.warehouseId,
      customerId:
        customerMode === "existing" ? checkoutValues.customerId : undefined,
      customerName:
        customerMode === "walk-in"
          ? trimOrUndefined(checkoutValues.customerName)
          : undefined,
      customerPhone:
        customerMode === "walk-in"
          ? trimOrUndefined(checkoutValues.customerPhone)
          : undefined,
      customerEmail:
        customerMode === "walk-in"
          ? trimOrUndefined(checkoutValues.customerEmail)
          : undefined,
      items: cartPos.map((item) => ({
        productId: item.product.id,
        variantId: item.variant?.id,
        quantity: Number(item.quantity),
        discountAmount: Number(item.discountAmount ?? 0),
      })),
      payment: {
        paymentMethod: checkoutValues.paymentMethod as PosPaymentMethod,
        financeAccountId: checkoutValues.financeAccountId,
      },
    };

    try {
      await createPosSale.mutateAsync(payload);
      resetCard();
      setCheckoutValues({ customerMode: "walk-in" });
      setVariantProduct(undefined);
      message.success("POS sale completed successfully.");
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="POS"
        subtitle="Select a warehouse, add products from available stock, adjust the cart, then complete the sale."
        breadcrumb={adminBreadcrumb}
      />

      <Card>
        <div className="flex flex-col gap-2 md:max-w-md">
          <Text strong>Warehouse</Text>
          <Select
            allowClear
            showSearch
            size="large"
            placeholder="Select warehouse first"
            optionFilterProp="label"
            loading={warehousesLoading}
            value={selectedWarehouseId}
            options={warehouseItems.map((warehouse) => ({
              label: warehouse.name,
              value: warehouse.id,
            }))}
            onChange={handleWarehouseChange}
          />
          <Text type="secondary">
            Products and stock availability are loaded from this warehouse.
          </Text>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-4">
          <ProductPicker
            products={productItems}
            loading={
              productsLoading ||
              productsFetching ||
              categoriesLoading ||
              brandsLoading ||
              tagsLoading
            }
            search={search}
            requireWarehouse
            selectedWarehouseId={selectedWarehouseId}
            categoryId={categoryId}
            brandId={brandId}
            tagId={tagId}
            categories={categoryItems}
            brands={brandItems}
            tags={tagItems}
            onSearch={(value) => {
              setSearch(value);
              setCurrentPage(1);
            }}
            onCategoryChange={(value) => {
              setCategoryId(value);
              setCurrentPage(1);
            }}
            onBrandChange={(value) => {
              setBrandId(value);
              setCurrentPage(1);
            }}
            onTagChange={(value) => {
              setTagId(value);
              setCurrentPage(1);
            }}
            onClearFilters={resetProductFilters}
            onSelect={handleProductSelect}
          />

          {selectedWarehouseId && totalProducts > PAGE_LIMIT && (
            <Card>
              <Pagination
                current={currentPage}
                pageSize={PAGE_LIMIT}
                total={totalProducts}
                showSizeChanger={false}
                onChange={setCurrentPage}
              />
            </Card>
          )}
        </div>

        <PosCart
          cart={cartPos}
          values={checkoutValues}
          taxes={taxItems}
          warehouses={warehouseItems}
          accounts={accountItems}
          customers={customerItems}
          loading={
            taxesLoading ||
            warehousesLoading ||
            accountsLoading ||
            customersLoading
          }
          submitting={createPosSale.isPending}
          onValuesChange={(values) =>
            setCheckoutValues((current) => ({ ...current, ...values }))
          }
          onItemChange={updateCartItem}
          onRemoveItem={(itemId) => removeCartItem(itemId)}
          onCheckout={handleCheckout}
        />
      </div>

      <VariantSelector
        open={Boolean(variantProduct)}
        product={variantProduct}
        onClose={() => setVariantProduct(undefined)}
        onAdd={handleAddItem}
      />
    </div>
  );
};

export default PosOrder;
