"use client";

import {
  App,
  Button,
  Card,
  Divider,
  Empty,
  Input,
  InputNumber,
  Pagination,
  Radio,
  Select,
  Space,
  Switch,
  Table,
  Typography,
} from "antd";
import { ShoppingCart, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useActiveBusinessId } from "@/hooks/use-active-business";
import {
  useCustomerQuery,
  useOrderMutations,
  useProductsQuery,
  useTaxQuery,
  useWarehousesQuery,
} from "@/lib/api";
import { useFinanceAccountQuery } from "@/lib/api/hooks/finance-account";
import { getApiErrorMessage } from "@/lib/axios";

import { ProductPicker } from "../../pos/_components/product-picker";
import { VariantSelector } from "../../pos/_components/variant-selector";

import type {
  OrderPaymentMethod,
  OrderPaymentPayload,
  OrderPayload,
} from "@/lib/api";
import type { ResponseProduct } from "@/types/product/product";
import type { PosCartItem } from "../../pos/_components/types";

const { Text, Title } = Typography;

const PAGE_LIMIT = 8;

type OrderDraftValues = {
  customerMode?: "existing" | "walk-in";
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  warehouseId?: string;
  shippingCharge?: number;
  note?: string;
  isCod?: boolean;
  paymentMethod?: OrderPaymentMethod;
  financeAccountId?: string;
};

const paymentMethodOptions: Array<{
  label: string;
  value: OrderPaymentMethod;
}> = [
    { label: "Cash", value: "CASH" },
    { label: "COD", value: "COD" },
    { label: "bKash", value: "BKASH" },
    { label: "Nagad", value: "NAGAD" },
    { label: "Card", value: "CARD" },
    { label: "Bank Transfer", value: "BANK_TRANSFER" },
    { label: "Other", value: "OTHER" },
  ];

const createCartId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;

const trimOrUndefined = (value?: string | null) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

const money = (value: number) => `BDT ${value.toLocaleString()}`;
const toNumber = (value?: string | number | null) => Number(value ?? 0);

const getProductAvailableQuantity = (product: ResponseProduct) => {
  if (!product.stockSummary) return undefined;
  return Number(product.stockSummary.availableQuantity ?? 0);
};

export default function CreateOrder() {
  const router = useRouter();
  const { message } = App.useApp();
  const businessId = useActiveBusinessId();

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<string>();
  const [cart, setCart] = useState<PosCartItem[]>([]);
  const [values, setValues] = useState<OrderDraftValues>({
    customerMode: "walk-in",
    shippingCharge: 0,
    isCod: false,
  });

  const products = useProductsQuery(businessId ?? "", {
    page: currentPage,
    limit: PAGE_LIMIT,
    search,
    status: "ACTIVE",
    sortOrder: "desc",
  });
  const customers = useCustomerQuery(businessId ?? "", {
    page: 1,
    limit: 100,
    status: "ACTIVE",
  });
  const warehouses = useWarehousesQuery(businessId ?? "", {
    page: 1,
    limit: 100,
    status: "ACTIVE",
  });
  const taxes = useTaxQuery(businessId ?? "", { status: "ACTIVE" });
  const accounts = useFinanceAccountQuery(businessId ?? "", {
    page: 1,
    limit: 100,
    status: "ACTIVE",
  });
  const mutations = useOrderMutations(businessId ?? "");

  const productItems = useMemo(
    () => products.data?.items ?? [],
    [products.data?.items],
  );
  const selectedProduct = useMemo(
    () => productItems.find((product) => product.id === selectedProductId),
    [productItems, selectedProductId],
  );

  const totals = useMemo(() => {
    const subtotal = cart.reduce(
      (total, item) => total + item.unitPrice * item.quantity,
      0,
    );
    const discountTotal = cart.reduce(
      (total, item) => total + Number(item.discountAmount ?? 0),
      0,
    );
    const taxTotal = cart.reduce((total, item) => {
      const selectedTax = taxes.data?.items?.find(
        (tax) => tax.id === item.product.taxId,
      );
      const taxRate = Number(selectedTax?.rate ?? 0);
      const lineSubtotal = item.unitPrice * item.quantity;
      const lineTaxableAmount = Math.max(
        lineSubtotal - Number(item.discountAmount ?? 0),
        0,
      );

      return total + lineTaxableAmount * (taxRate / 100);
    }, 0);
    const taxableAmount = Math.max(subtotal - discountTotal, 0);
    const shipping = Number(values.shippingCharge ?? 0);

    return {
      subtotal,
      discountTotal,
      taxTotal,
      shipping,
      total: taxableAmount + taxTotal + shipping,
    };
  }, [cart, taxes.data?.items, values.shippingCharge]);

  const updateValues = (nextValues: Partial<OrderDraftValues>) => {
    setValues((current) => ({ ...current, ...nextValues }));
  };

  const handleAddItem = (
  item: Omit<PosCartItem, "id">,
) => {
  setCart((current) => {
    const existingItem = current.find(
      (cartItem) =>
        cartItem.product.id === item.product.id &&
        cartItem.variant?.id === item.variant?.id,
    );

    // Increase quantity when the exact product/variant exists
    if (existingItem) {
      return current.map((cartItem) => {
        const isSameItem =
          cartItem.product.id === item.product.id &&
          cartItem.variant?.id === item.variant?.id;

        if (isSameItem) {
          return {
            ...cartItem,
            quantity: cartItem.quantity + 1,
          };
        }

        return cartItem;
      });
    }

    // Add a new product or variant
    return [
      ...current,
      {
        ...item,
        id: createCartId(),
      },
    ];
  });
};

  const handleProductSelect = (product: ResponseProduct) => {
    const availableQuantity = getProductAvailableQuantity(product);

    if (availableQuantity !== undefined && availableQuantity <= 0) {
      message.warning("This product is out of stock.");
      return;
    }

    if (product.variants?.length) {
      setSelectedProductId(product.id);
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

  const handleItemChange = (
    itemId: string,
    nextValues: Partial<PosCartItem>,
  ) => {
    setCart((current) =>
      current.map((item) =>
        item.id === itemId ? { ...item, ...nextValues } : item,
      ),
    );
  };

  const resolvePayment = (): OrderPaymentPayload | undefined => {
    if (values.isCod) {
      return {
        paymentMethod: "COD",
      };
    }

    if (!values.paymentMethod) return undefined;

    return {
      paymentMethod: values.paymentMethod,
      financeAccountId: values.financeAccountId,
    };
  };

  const handleCreateOrder = async () => {
    if (!businessId) return;

    const customerMode = values.customerMode ?? "walk-in";

    if (!values.warehouseId) {
      message.error("Select a warehouse.");
      return;
    }

    if (customerMode === "existing" && !values.customerId) {
      message.error("Select an existing customer.");
      return;
    }

    if (!cart.length) {
      message.error("Add at least one order item.");
      return;
    }

    if (
      values.paymentMethod &&
      values.paymentMethod !== "COD" &&
      !values.financeAccountId
    ) {
      message.error("Select a finance account for this payment method.");
      return;
    }

    const payload: OrderPayload = {
      customerId: customerMode === "existing" ? values.customerId : undefined,
      warehouseId: values.warehouseId,
      payment: resolvePayment(),
      orderType: "ADMIN",
      orderSource: "ADMIN_PANEL",
      customerName:
        customerMode === "walk-in"
          ? trimOrUndefined(values.customerName)
          : undefined,
      customerPhone:
        customerMode === "walk-in"
          ? trimOrUndefined(values.customerPhone)
          : undefined,
      customerEmail:
        customerMode === "walk-in"
          ? trimOrUndefined(values.customerEmail)
          : undefined,
      shippingCharge: Number(values.shippingCharge ?? 0),
      note: trimOrUndefined(values.note),
      isCod: Boolean(values.isCod),
      items: cart.map((item) => ({
        productId: item.product.id,
        variantId: item.variant?.id,
        quantity: Number(item.quantity),
        discountAmount: Number(item.discountAmount ?? 0),
      })),
    };

    try {
      await mutations.createOrder.mutateAsync(payload);
      message.success("Order created.");
      router.push("/admin/dashboard/orders");
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
  };

  const customerMode = values.customerMode ?? "walk-in";
  const totalProducts = products.data?.meta?.total ?? 0;
  const canSubmit = Boolean(values.warehouseId && cart.length);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Order"
        subtitle="Search products, resolve variants by attributes, then build the order from a cart-style checkout panel."
        breadcrumb={adminBreadcrumb}
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_460px]">
        <div className="space-y-4">
          <ProductPicker
            products={productItems}
            loading={products.isLoading || products.isFetching}
            search={search}
            selectedProductId={selectedProductId}
            onSearch={(value) => {
              setSearch(value);
              setCurrentPage(1);
            }}
            onSelect={handleProductSelect}
          />

          {totalProducts > PAGE_LIMIT ? (
            <Card>
              <Pagination
                current={currentPage}
                pageSize={PAGE_LIMIT}
                total={totalProducts}
                showSizeChanger={false}
                onChange={setCurrentPage}
              />
            </Card>
          ) : null}

          <VariantSelector
            open={Boolean(selectedProduct)}
            product={selectedProduct}
            onClose={() => setSelectedProductId(undefined)}
            onAdd={handleAddItem}
          />
        </div>

        <Card title="Order & Checkout">
          <Space direction="vertical" size="middle" className="w-full">
            <Table<PosCartItem>
              size="small"
              rowKey="id"
              dataSource={cart}
              pagination={false}
              locale={{ emptyText: <Empty description="No items added" /> }}
              columns={[
                {
                  title: "Item",
                  key: "item",
                  width: 190,
                  render: (_, item) => (
                    <div className="min-w-0 max-w-[180px]">
                      <Text
                        strong
                        className="block"
                        ellipsis={{ tooltip: item.product.name }}
                      >
                        {item.product.name}
                      </Text>
                      <div className="truncate text-xs text-gray-500">
                        {item.variant?.title ?? "No variant"}
                      </div>
                    </div>
                  ),
                },
                {
                  title: "Qty",
                  width: 100,
                  render: (_, item) => (
                    <InputNumber
                      min={1}
                      max={item.availableQuantity}
                      value={item.quantity}
                      onChange={(quantity) =>
                        handleItemChange(item.id, {
                          quantity: Number(quantity ?? 1),
                        })
                      }
                    />
                  ),
                },
                {
                  title: "Discount",
                  width: 120,
                  render: (_, item) => (
                    <InputNumber
                      min={0}
                      max={item.unitPrice * item.quantity}
                      value={item.discountAmount}
                      onChange={(discountAmount) =>
                        handleItemChange(item.id, {
                          discountAmount: Number(discountAmount ?? 0),
                        })
                      }
                    />
                  ),
                },
                {
                  title: "",
                  width: 48,
                  render: (_, item) => (
                    <Button
                      danger
                      size="small"
                      icon={<Trash2 />}
                      onClick={() =>
                        setCart((current) =>
                          current.filter((entry) => entry.id !== item.id),
                        )
                      }
                    />
                  ),
                },
              ]}
              scroll={{ x: "max-content" }}
            />

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="md:col-span-2">
                <Text type="secondary">Customer</Text>
                <br />
                <Radio.Group
                  className="mt-1"
                  optionType="button"
                  buttonStyle="solid"
                  value={customerMode}
                  options={[
                    { label: "Walk-in", value: "walk-in" },
                    { label: "Existing", value: "existing" },
                  ]}
                  onChange={(event) =>
                    updateValues({
                      customerMode: event.target.value,
                      customerId: undefined,
                      customerName: undefined,
                      customerPhone: undefined,
                      customerEmail: undefined,
                    })
                  }
                />
              </div>

              {customerMode === "existing" ? (
                <div className="md:col-span-2">
                  <Text type="secondary">Existing Customer</Text>
                  <Select
                    allowClear
                    showSearch
                    className="mt-1 w-full"
                    placeholder="Select customer"
                    optionFilterProp="label"
                    value={values.customerId}
                    options={(customers.data?.items ?? []).map((customer) => ({
                      label: `${customer.name}${customer.phone ? ` (${customer.phone})` : ""}`,
                      value: customer.id,
                    }))}
                    onChange={(customerId) => updateValues({ customerId })}
                  />
                </div>
              ) : (
                <>
                  <div>
                    <Text type="secondary">Customer Name</Text>
                    <Input
                      className="mt-1"
                      placeholder="Walk-in Customer"
                      value={values.customerName}
                      onChange={(event) =>
                        updateValues({ customerName: event.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Text type="secondary">Customer Phone</Text>
                    <Input
                      className="mt-1"
                      placeholder="+880..."
                      value={values.customerPhone}
                      onChange={(event) =>
                        updateValues({ customerPhone: event.target.value })
                      }
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Text type="secondary">Customer Email</Text>
                    <Input
                      className="mt-1"
                      placeholder="customer@example.com"
                      value={values.customerEmail}
                      onChange={(event) =>
                        updateValues({ customerEmail: event.target.value })
                      }
                    />
                  </div>
                </>
              )}

              <div>
                <Text type="secondary">Warehouse</Text>
                <Select
                  allowClear
                  showSearch
                  className="mt-1 w-full"
                  placeholder="Select warehouse"
                  optionFilterProp="label"
                  value={values.warehouseId}
                  options={(warehouses.data?.items ?? []).map((warehouse) => ({
                    label: warehouse.name,
                    value: warehouse.id,
                  }))}
                  onChange={(warehouseId) => updateValues({ warehouseId })}
                />
              </div>

              <div>
                <Text type="secondary">Shipping Charge</Text>
                <InputNumber
                  min={0}
                  className="mt-1 w-full"
                  value={values.shippingCharge}
                  onChange={(shippingCharge) =>
                    updateValues({
                      shippingCharge: Number(shippingCharge ?? 0),
                    })
                  }
                />
              </div>

              <div>
                <Text type="secondary">COD</Text>
                <div className="mt-1">
                  <Switch
                    checked={values.isCod}
                    checkedChildren="Yes"
                    unCheckedChildren="No"
                    onChange={(isCod) =>
                      updateValues({
                        isCod,
                        paymentMethod: isCod ? "COD" : undefined,
                        financeAccountId: undefined,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <Text type="secondary">Payment Method</Text>
                <Select
                  allowClear
                  disabled={values.isCod}
                  className="mt-1 w-full"
                  placeholder="Optional payment"
                  value={values.paymentMethod}
                  options={paymentMethodOptions.filter(
                    (option) => option.value !== "COD",
                  )}
                  onChange={(paymentMethod) =>
                    updateValues({
                      paymentMethod,
                      financeAccountId: undefined,
                    })
                  }
                />
              </div>

              <div className="md:col-span-2">
                <Text type="secondary">Finance Account</Text>
                <Select
                  allowClear
                  showSearch
                  disabled={!values.paymentMethod || values.isCod}
                  className="mt-1 w-full"
                  placeholder="Select account for payment"
                  optionFilterProp="label"
                  value={values.financeAccountId}
                  options={(accounts.data?.items ?? []).map((account) => ({
                    label: `${account.name} (${account.accountType})`,
                    value: account.id,
                  }))}
                  onChange={(financeAccountId) =>
                    updateValues({ financeAccountId })
                  }
                />
              </div>

              <div className="md:col-span-2">
                <Text type="secondary">Note</Text>
                <Input.TextArea
                  className="mt-1"
                  rows={3}
                  placeholder="Internal order note"
                  value={values.note}
                  onChange={(event) =>
                    updateValues({ note: event.target.value })
                  }
                />
              </div>
            </div>

            <Divider className="my-2" />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Text type="secondary">Subtotal</Text>
                <Text>{money(totals.subtotal)}</Text>
              </div>
              <div className="flex items-center justify-between">
                <Text type="secondary">Discount</Text>
                <Text>{money(totals.discountTotal)}</Text>
              </div>
              <div className="flex items-center justify-between">
                <Text type="secondary">Product tax estimate</Text>
                <Text>{money(totals.taxTotal)}</Text>
              </div>
              <div className="flex items-center justify-between">
                <Text type="secondary">Shipping</Text>
                <Text>{money(totals.shipping)}</Text>
              </div>
              <div className="flex items-center justify-between">
                <Title level={5} className="m-0">
                  Total
                </Title>
                <Title level={5} className="m-0">
                  {money(totals.total)}
                </Title>
              </div>
            </div>

            <Button
              type="primary"
              block
              size="large"
              icon={<ShoppingCart />}
              disabled={!canSubmit}
              loading={mutations.createOrder.isPending}
              onClick={handleCreateOrder}
            >
              Create Order
            </Button>
          </Space>
        </Card>
      </div>
    </div>
  );
}
