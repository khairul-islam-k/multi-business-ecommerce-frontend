"use client";

import {
  Alert,
  Button,
  Card,
  Divider,
  Empty,
  Input,
  InputNumber,
  Radio,
  Select,
  Space,
  Table,
  Typography,
} from "antd";
import { DeleteOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { CustomerResponse } from "@/types/customer/customer";
import { FinanceAccountResponse } from "@/types/finance/account";
import { TaxResponse } from "@/types/finance/tax";
import { WarehouseResponse } from "@/types/product/warehouse";
import { PosPaymentMethod } from "@/types/pos";
import { PosCartItem, PosCheckoutValues } from "./types";

const { Text, Title } = Typography;

const paymentMethods: Array<{ label: string; value: PosPaymentMethod }> = [
  { label: "Cash", value: "CASH" },
  { label: "COD", value: "COD" },
  { label: "bKash", value: "BKASH" },
  { label: "Nagad", value: "NAGAD" },
  { label: "Card", value: "CARD" },
  { label: "Bank Transfer", value: "BANK_TRANSFER" },
  { label: "Other", value: "OTHER" },
];

type PosCartProps = {
  cart: PosCartItem[];
  values: PosCheckoutValues;
  taxes: TaxResponse[];
  warehouses: WarehouseResponse[];
  accounts: FinanceAccountResponse[];
  customers: CustomerResponse[];
  loading: boolean;
  submitting: boolean;
  onValuesChange: (values: Partial<PosCheckoutValues>) => void;
  onItemChange: (itemId: string, values: Partial<PosCartItem>) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
};

const money = (value: number) => `BDT ${value.toLocaleString()}`;

export function PosCart({
  cart,
  values,
  taxes,
  warehouses,
  accounts,
  customers,
  loading,
  submitting,
  onValuesChange,
  onItemChange,
  onRemoveItem,
  onCheckout,
}: PosCartProps) {
  const subtotal = cart.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0,
  );
  const discountTotal = cart.reduce(
    (total, item) => total + Number(item.discountAmount ?? 0),
    0,
  );
  const selectedTax = taxes.find((tax) => tax.id === values.taxId);
  const taxRate = Number(selectedTax?.rate ?? 0);
  const taxableAmount = Math.max(subtotal - discountTotal, 0);
  const taxAmount = taxableAmount * (taxRate / 100);
  const grandTotal = taxableAmount + taxAmount;
  const customerMode = values.customerMode ?? "walk-in";
  const canCheckout =
    cart.length > 0 &&
    Boolean(values.taxId) &&
    Boolean(values.paymentMethod) &&
    Boolean(values.financeAccountId) &&
    (customerMode !== "existing" || Boolean(values.customerId));

  return (
    <Card title="Cart & Checkout">
      <Space direction="vertical" size="middle" className="w-full">
        {accounts.length === 0 && (
          <Alert
            type="warning"
            showIcon
            message="No active finance account found. Create one before completing a POS sale."
          />
        )}

        <Table<PosCartItem>
          size="small"
          rowKey="id"
          dataSource={cart}
          loading={loading}
          pagination={false}
          locale={{
            emptyText: <Empty description="No items added" />,
          }}
          columns={[
            {
              title: "Item",
              key: "item",
              render: (_, item) => (
                <div>
                  <Text strong>{item.product.name}</Text>
                  <div className="text-xs text-gray-500">
                    {item.variant?.title ?? "No variant"}
                  </div>
                </div>
              ),
            },
            {
              title: "Qty",
              dataIndex: "quantity",
              width: 110,
              render: (_, item) => (
                <InputNumber
                  min={1}
                  max={item.availableQuantity}
                  value={item.quantity}
                  onChange={(value) =>
                    onItemChange(item.id, { quantity: Number(value ?? 1) })
                  }
                />
              ),
            },
            {
              title: "Discount",
              dataIndex: "discountAmount",
              width: 130,
              render: (_, item) => (
                <InputNumber
                  min={0}
                  max={item.unitPrice * item.quantity}
                  value={item.discountAmount}
                  onChange={(value) =>
                    onItemChange(item.id, {
                      discountAmount: Number(value ?? 0),
                    })
                  }
                />
              ),
            },
            {
              title: "Total",
              key: "total",
              align: "right",
              render: (_, item) =>
                money(
                  Math.max(
                    item.unitPrice * item.quantity - item.discountAmount,
                    0,
                  ),
                ),
            },
            {
              title: "",
              key: "actions",
              width: 48,
              render: (_, item) => (
                <Button
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => onRemoveItem(item.id)}
                />
              ),
            },
          ]}
        />

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="md:col-span-2">
            <Text type="secondary">Customer</Text>
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
                onValuesChange({
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
                options={customers.map((customer) => ({
                  label: `${customer.name}${customer.phone ? ` (${customer.phone})` : ""}`,
                  value: customer.id,
                }))}
                onChange={(customerId) => onValuesChange({ customerId })}
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
                    onValuesChange({ customerName: event.target.value })
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
                    onValuesChange({ customerPhone: event.target.value })
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
                    onValuesChange({ customerEmail: event.target.value })
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
              options={warehouses.map((warehouse) => ({
                label: warehouse.name,
                value: warehouse.id,
              }))}
              onChange={(warehouseId) => onValuesChange({ warehouseId })}
            />
          </div>

          <div>
            <Text type="secondary">Tax</Text>
            <Select
              showSearch
              className="mt-1 w-full"
              placeholder="Select tax"
              optionFilterProp="label"
              value={values.taxId}
              options={taxes.map((tax) => ({
                label: `${tax.name} (${tax.rate}%)`,
                value: tax.id,
              }))}
              onChange={(taxId) => onValuesChange({ taxId })}
            />
          </div>

          <div>
            <Text type="secondary">Payment Method</Text>
            <Select
              className="mt-1 w-full"
              placeholder="Select method"
              value={values.paymentMethod}
              options={paymentMethods}
              onChange={(paymentMethod) => onValuesChange({ paymentMethod })}
            />
          </div>

          <div>
            <Text type="secondary">Finance Account</Text>
            <Select
              showSearch
              className="mt-1 w-full"
              placeholder="Select account"
              optionFilterProp="label"
              value={values.financeAccountId}
              options={accounts.map((account) => ({
                label: `${account.name} (${account.accountType})`,
                value: account.id,
              }))}
              onChange={(financeAccountId) =>
                onValuesChange({ financeAccountId })
              }
            />
          </div>
        </div>

        <Divider className="my-2" />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Text type="secondary">Subtotal</Text>
            <Text>{money(subtotal)}</Text>
          </div>
          <div className="flex items-center justify-between">
            <Text type="secondary">Discount</Text>
            <Text>{money(discountTotal)}</Text>
          </div>
          <div className="flex items-center justify-between">
            <Text type="secondary">Tax</Text>
            <Text>{money(taxAmount)}</Text>
          </div>
          <div className="flex items-center justify-between">
            <Title level={5} className="m-0">
              Total
            </Title>
            <Title level={5} className="m-0">
              {money(grandTotal)}
            </Title>
          </div>
        </div>

        <Button
          type="primary"
          block
          size="large"
          icon={<ShoppingCartOutlined />}
          disabled={!canCheckout}
          loading={submitting}
          onClick={onCheckout}
        >
          Complete Sale
        </Button>
      </Space>
    </Card>
  );
}
