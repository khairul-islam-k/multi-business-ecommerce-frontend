"use client";

import { useMemo, useState } from "react";
import { App, Card, Pagination } from "antd";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useFinanceAccountQuery } from "@/lib/api/hooks/finance-account";
import { usePosSaleMutation } from "@/lib/api/hooks/pos";
import { useProductsQuery } from "@/lib/api/hooks/product";
import { useTaxQuery } from "@/lib/api/hooks/tax";
import { useWarehousesQuery } from "@/lib/api/hooks/warehouse";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import { CreatePosSalePayload, PosPaymentMethod } from "@/types/pos";
import { ProductPicker } from "./_components/product-picker";
import { PosCart } from "./_components/pos-cart";
import { PosCartItem, PosCheckoutValues } from "./_components/types";
import { VariantSelector } from "./_components/variant-selector";

const PAGE_LIMIT = 8;

const createCartId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;

const trimOrUndefined = (value?: string) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

const PosOrder = () => {
  const { message } = App.useApp();
  const business = useAuthStore((state) => state.selectedBusiness);
  const businessId = business?.id ?? "";
  const addToCard = useAuthStore(s => s.addCartItem);
  const cartPos = useAuthStore(s => s.cartPos);
  const removeCartItem = useAuthStore(s => s.removeCartItem);
  const updateCartItem = useAuthStore(s => s.updateCartItem);
  const resetCard = useAuthStore(s => s.clearCart);

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<string>();
  const [checkoutValues, setCheckoutValues] = useState<PosCheckoutValues>({});

  const {
    data: products,
    isLoading: productsLoading,
    isFetching: productsFetching,
  } = useProductsQuery(businessId, {
    page: currentPage,
    limit: PAGE_LIMIT,
    search,
    status: "ACTIVE",
    sortOrder: "desc",
  });

  const { data: taxes, isLoading: taxesLoading } = useTaxQuery(businessId, {
    status: "ACTIVE",
  });

  const { data: warehouses, isLoading: warehousesLoading } = useWarehousesQuery(
    businessId,
    {
      status: "ACTIVE",
    },
  );

  const { data: accounts, isLoading: accountsLoading } = useFinanceAccountQuery(
    businessId,
    {
      status: "ACTIVE",
    },
  );

  const createPosSale = usePosSaleMutation(businessId);

  const productItems = useMemo(() => products?.items ?? [], [products?.items]);
  const taxItems = taxes?.items ?? [];
  const warehouseItems = warehouses?.items ?? [];
  const accountItems = accounts?.items ?? [];
  const totalProducts = products?.meta?.total ?? 0;

  const selectedProduct = useMemo(
    () => productItems.find((product) => product.id === selectedProductId),
    [productItems, selectedProductId],
  );

  const handleAddItem = (item: Omit<PosCartItem, "id">) => {
    addToCard({
      ...item,
      id: createCartId()
    });
  };

  const handleCheckout = async () => {
    if (
      !checkoutValues.taxId ||
      !checkoutValues.paymentMethod ||
      !checkoutValues.financeAccountId ||
      cartPos.length === 0
    ) {
      message.error("Complete the required checkout fields first.");
      return;
    }

    const payload: CreatePosSalePayload = {
      taxId: checkoutValues.taxId,
      warehouseId: checkoutValues.warehouseId,
      customerName: trimOrUndefined(checkoutValues.customerName),
      customerPhone: trimOrUndefined(checkoutValues.customerPhone),
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
      setCheckoutValues({});
      setSelectedProductId(undefined);
      message.success("POS sale completed successfully.");
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="POS"
        subtitle="Select products, resolve variants by attributes, add quantities and discounts, then complete the sale from one page."
        breadcrumb={adminBreadcrumb}
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-4">
          <ProductPicker
            products={productItems}
            loading={productsLoading || productsFetching}
            search={search}
            selectedProductId={selectedProductId}
            onSearch={(value) => {
              setSearch(value);
              setCurrentPage(1);
            }}
            onSelect={(product) => setSelectedProductId(product.id)}
          />

          {totalProducts > PAGE_LIMIT && (
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

          <VariantSelector
            key={selectedProduct?.id ?? "no-product"}
            businessId={businessId}
            product={selectedProduct}
            onAdd={handleAddItem}
          />
        </div>

        <PosCart
          cart={cartPos}
          values={checkoutValues}
          taxes={taxItems}
          warehouses={warehouseItems}
          accounts={accountItems}
          loading={taxesLoading || warehousesLoading || accountsLoading}
          submitting={createPosSale.isPending}
          onValuesChange={(values) =>
            setCheckoutValues((current) => ({ ...current, ...values }))
          }
          onItemChange={updateCartItem}
          onRemoveItem={(itemId) => removeCartItem(itemId)}
          onCheckout={handleCheckout}
        />
      </div>
    </div>
  );
};

export default PosOrder;
