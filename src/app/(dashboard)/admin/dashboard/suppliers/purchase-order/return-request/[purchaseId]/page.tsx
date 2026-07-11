"use client";

import {
  App,
  Button,
  Card,
  Checkbox,
  Empty,
  Form,
  Input,
  InputNumber,
  Spin,
  Typography,
} from "antd";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import {
  usePurchaseOrder,
  usePurchaseOrderMutation,
} from "@/lib/api/hooks/purchase-order";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import { StockItem } from "@/types/stock/stock";
import { PurchaseOrderItemResponse } from "@/types/suppliers/purchase-order";

type ReturnPayload = {
  reason: string;
  items: {
    productId: string;
    variantId?: string | null;
    quantity: number;
    reason: string;
  }[];
};

type ReturnFormValues = {
  reason: string;
  items: {
    checked: boolean;
    quantity: number;
    reason: string;
  }[];
};

const PurchaseOrderReturn = () => {
  const [form] = Form.useForm<ReturnFormValues>();
  const { message } = App.useApp();
  const router = useRouter();

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { purchaseId } = useParams<{ purchaseId: string }>();

  const {
    data: purchase,
    isLoading,
    isFetching,
  } = usePurchaseOrder(businessId, purchaseId);

  const { purchaseOrderReturnRequest } = usePurchaseOrderMutation(businessId);

  // Available Quantity
  const sumTotalQuantity = (stocks?: StockItem[]) => {
    return (
      stocks?.reduce((total, stock) => {
        return total + Number(stock.totalQuantity ?? 0);
      }, 0) ?? 0
    );
  };

  const getAvailableStockQuantity = (item: PurchaseOrderItemResponse) => {
    if (item.variant) {
      return sumTotalQuantity(item?.variant.variantStocks);
    }

    return sumTotalQuantity(item.product?.productStocks);
  };

  useEffect(() => {
    if (!purchase?.items?.length) return;

    form.setFieldsValue({
      items: purchase.items.map((item) => {
        const availableStockQty = getAvailableStockQuantity(item);

        return {
          checked: false,
          quantity: availableStockQty,
        };
      }),
    });
  }, [purchase, form]);

  // available

  const handleSubmit = async (values: ReturnFormValues) => {
    if (!purchase?.items?.length) {
      message.error("Purchase items not found.");
      return;
    }

    const selectedItems = values.items
      .map((item, index) => {
        const purchaseItem = purchase.items[index];

        return {
          checked: item.checked,
          productId: purchaseItem.productId,
          variantId: purchaseItem.variantId,
          quantity: item.quantity,
          reason: item.reason,
        };
      })
      .filter((item) => item.checked);

    if (!selectedItems.length) {
      message.error("Please select at least one item.");
      return;
    }

    setIsSubmitting(true);

    const payload: ReturnPayload = {
      reason: values.reason,
      items: selectedItems.map(({ checked, variantId, ...item }) => ({
        ...item,
        ...(variantId ? { variantId } : {}),
      })),
    };

    try {
      const res = await purchaseOrderReturnRequest.mutateAsync({
        purchaseId,
        payload,
      });
      router.push("/admin/dashboard/suppliers/purchase-order");
      message.success("Purchase Order returned successfully");
    } catch (error) {
      message.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || isFetching) {
    return (
      <div className="flex justify-center py-10">
        <Spin />
      </div>
    );
  }

  if (!purchase?.items?.length) {
    return <Empty description="No purchase items found" />;
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Purchase Return Request"
        subtitle="Create and manage return requests for purchased items."
        breadcrumb={adminBreadcrumb}
      />

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Return Reason"
          name="reason"
          rules={[{ required: true, message: "Return reason is required" }]}
        >
          <Input.TextArea rows={3} placeholder="Write main return reason" />
        </Form.Item>

        <div className="space-y-3">
          {purchase.items.map((item, index) => {
            const maxQuantity = Number(item.quantityReceived);

            return (
              <Card key={item.id} size="small">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_180px] md:items-start">
                    <div>
                      <Form.Item
                        name={["items", index, "checked"]}
                        valuePropName="checked"
                        className="mb-1"
                      >
                        <Checkbox>
                          <Typography.Text strong>
                            {item.product?.name ?? "Product"}
                          </Typography.Text>
                        </Checkbox>
                      </Form.Item>

                      <Typography.Text type="secondary">
                        Variant: {item.variant?.title ?? "N/A"} | Received:{" "}
                        {maxQuantity}
                      </Typography.Text>
                    </div>

                    <Form.Item
                      shouldUpdate={(prev, cur) =>
                        prev.items?.[index]?.checked !==
                        cur.items?.[index]?.checked
                      }
                      noStyle
                    >
                      {({ getFieldValue }) => {
                        const checked = getFieldValue([
                          "items",
                          index,
                          "checked",
                        ]);

                        return (
                          <Form.Item
                            label="Quantity"
                            name={["items", index, "quantity"]}
                            rules={
                              checked
                                ? [
                                    {
                                      required: true,
                                      message: "Quantity is required",
                                    },
                                  ]
                                : []
                            }
                          >
                            <InputNumber
                              min={1}
                              // max={maxQuantity}
                              className="w-full"
                              disabled={!checked}
                            />
                          </Form.Item>
                        );
                      }}
                    </Form.Item>
                  </div>

                  <Form.Item
                    shouldUpdate={(prev, cur) =>
                      prev.items?.[index]?.checked !==
                      cur.items?.[index]?.checked
                    }
                    noStyle
                  >
                    {({ getFieldValue }) => {
                      const checked = getFieldValue([
                        "items",
                        index,
                        "checked",
                      ]);

                      return (
                        <Form.Item
                          label="Reason"
                          name={["items", index, "reason"]}
                          rules={
                            checked
                              ? [
                                  {
                                    required: true,
                                    message: "Reason is required",
                                  },
                                ]
                              : []
                          }
                        >
                          <Input.TextArea
                            rows={3}
                            placeholder="Write item return reason"
                            disabled={!checked}
                          />
                        </Form.Item>
                      );
                    }}
                  </Form.Item>
                </div>
              </Card>
            );
          })}
        </div>

        <Button
          htmlType="submit"
          loading={isSubmitting}
          type="primary"
          danger
          className="mt-4"
        >
          Submit Return Request
        </Button>
      </Form>
    </div>
  );
};

export default PurchaseOrderReturn;
