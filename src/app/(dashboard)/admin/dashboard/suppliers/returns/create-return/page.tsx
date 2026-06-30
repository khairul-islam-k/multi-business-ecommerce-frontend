"use client";

import {
  App,
  Button,
  Card,
  Checkbox,
  Empty,
  Flex,
  Form,
  Input,
  InputNumber,
  Select,
  Typography,
} from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Loader from "@/components/shared/loader";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import {
  usePurchaseOrderMutation,
  usePurchaseOrderQuery,
} from "@/lib/api/hooks/purchase-order";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import { StockItem } from "@/types/stock/stock";
import {
  PurchaseOrderItemResponse,
  PurchaseOrderResponse,
} from "@/types/suppliers/purchase-order";

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

const CreateReturnRequest = () => {
  const [form] = Form.useForm<ReturnFormValues>();
  const { message } = App.useApp();
  const router = useRouter();

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState<
    PurchaseOrderResponse | undefined
  >(undefined);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: purchaseOrder,
    isLoading,
    isFetching,
  } = usePurchaseOrderQuery(businessId);

  const { purchaseOrderReturnRequest } = usePurchaseOrderMutation(businessId);

  const purchaseItems = selectedPurchaseOrder?.items ?? [];

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
    if (!purchaseItems.length) return;

    form.setFieldsValue({
      items: purchaseItems.map((item) => {
        const availableStockQty = getAvailableStockQuantity(item);

        return {
          checked: false,
          quantity: availableStockQty,
        };
      }),
    });
  }, [purchaseItems, form]);

  //   available end

  const handleSubmit = async (values: ReturnFormValues) => {
    if (!selectedPurchaseOrder?.id) {
      message.error("Please select a purchase order.");
      return;
    }

    if (!purchaseItems.length) {
      message.error("Purchase items not found.");
      return;
    }

    const selectedItems = (values.items ?? [])
      .map((item, index) => {
        const purchaseItem = purchaseItems[index];

        if (!purchaseItem || !item.checked) return null;

        return {
          productId: purchaseItem.productId,
          variantId: purchaseItem.variantId,
          quantity: item.quantity,
          reason: item.reason,
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item));

    if (!selectedItems.length) {
      message.error("Please select at least one item.");
      return;
    }

    const payload: ReturnPayload = {
      reason: values.reason,
      items: selectedItems.map(({ variantId, ...item }) => ({
        ...item,
        ...(variantId ? { variantId } : {}),
      })),
    };

    try {
      setIsSubmitting(true);

      await purchaseOrderReturnRequest.mutateAsync({
        purchaseId: selectedPurchaseOrder.id,
        payload,
      });

      message.success("Purchase return request created successfully.");
      router.push("/admin/dashboard/suppliers/purchase-order");
    } catch (error) {
      message.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || isFetching) {
    return <Loader />;
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Purchase Return Request"
        subtitle="Create and manage return requests for purchased items."
        breadcrumb={adminBreadcrumb}
      />

      <Flex>
        <Card>
          <Typography.Text strong>Purchase Order : </Typography.Text>
          <Select
            showSearch
            allowClear
            placeholder="Select purchase order"
            loading={isLoading}
            optionFilterProp="label"
            options={(purchaseOrder?.items ?? []).map((item) => ({
              label: item.purchaseOrderNo,
              value: item.id,
            }))}
            onChange={(value) => {
              const selected = purchaseOrder?.items.find(
                (item) => item.id === value,
              );

              setSelectedPurchaseOrder(selected);
            }}
            onClear={() => {
              setSelectedPurchaseOrder(undefined);
              form.resetFields();
            }}
          />
        </Card>
      </Flex>

      {!selectedPurchaseOrder ? (
        <Empty description="Please select a purchase order" />
      ) : !purchaseItems.length ? (
        <Empty description="No purchase items found" />
      ) : (
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Return Reason"
            name="reason"
            rules={[{ required: true, message: "Return reason is required" }]}
          >
            <Input.TextArea rows={3} placeholder="Write main return reason" />
          </Form.Item>

          <div className="space-y-3">
            {purchaseItems.map((item, index) => {
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
                                      {
                                        type: "number",
                                        min: 1,
                                        max: maxQuantity,
                                        message: `Quantity must be between 1 and ${maxQuantity}`,
                                      },
                                    ]
                                  : []
                              }
                            >
                              <InputNumber
                                min={1}
                                max={maxQuantity}
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
      )}
    </div>
  );
};

export default CreateReturnRequest;
