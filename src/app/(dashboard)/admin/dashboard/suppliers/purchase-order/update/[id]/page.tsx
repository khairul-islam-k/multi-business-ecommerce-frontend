"use client";

import {
  ArrowLeft
} from "lucide-react";

import Loader from "@/components/shared/loader";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { usePurchaseOrder, usePurchaseOrderMutation } from "@/lib/api/hooks/purchase-order";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import { PurchaseOrderStatus, UpdatePurchaseOrderPayload } from "@/types/suppliers/purchase-order";
import {
  App,
  Button,
  Card,
  DatePicker,
  Form,
  InputNumber,
  Select,
  Space,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs, { Dayjs } from "dayjs";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type UpdatePurchaseOrderFormValues = {
  expectedDeliveryDate?: Dayjs;
  status?: PurchaseOrderStatus;
  shippingCost?: number;
  note?: string;
};

// type UpdatePurchaseOrderPayload = {
//   expectedDeliveryDate: string;
//   status: PurchaseOrderStatus;
//   shippingCost: number;
//   note: string;
// };

const UpdatePurchaseOrder = () => {
  const [form] = Form.useForm<UpdatePurchaseOrderFormValues>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {message} = App.useApp();

  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const { data: purchaseOrder, isLoading, isFetching } = usePurchaseOrder(businessId, id);

  const { updatePurchase } = usePurchaseOrderMutation(businessId);

  const handleFinish = async (values: UpdatePurchaseOrderFormValues) => {
    try {
      setIsSubmitting(true);

      const payload: UpdatePurchaseOrderPayload = {
        expectedDeliveryDate: values.expectedDeliveryDate?.toISOString(),
        status: values.status,
        shippingCost: Number(values.shippingCost ?? 0),
        note: values.note?.trim() || undefined,
      };

      console.log("payload", payload);
      await updatePurchase.mutateAsync({
        purchaseId: id,
        payload
      })

      router.push("/admin/dashboard/suppliers/purchase-order");
      message.success("Purchase Order update successfully");
    } catch(error) {
      message.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!purchaseOrder) return;

    form.setFieldsValue({
      expectedDeliveryDate: purchaseOrder.expectedDeliveryDate
        ? dayjs(purchaseOrder.expectedDeliveryDate)
        : undefined,
      status: purchaseOrder.status,
      shippingCost: Number(purchaseOrder.shippingCost ?? 0),
      note: purchaseOrder.note ?? "",
    });
  }, [form, purchaseOrder]);

  if (isLoading || isFetching) {
    return <Loader />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Update Purchase Order"
        subtitle="Update procurement order delivery date, status, shipping cost, and note."
        breadcrumb={adminBreadcrumb}
      />

      <Card
        title="Update Purchase Order"
        extra={
          <Button icon={<ArrowLeft />} onClick={() => router.back()}>
            Back
          </Button>
        }
      >
        <Form<UpdatePurchaseOrderFormValues>
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            status: "DRAFT",
            shippingCost: 0,
            note: "",
          }}
        >
          <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
            <Form.Item label="Expected Delivery Date" name="expectedDeliveryDate">
              <DatePicker className="w-full" />
            </Form.Item>

            <Form.Item label="Status" name="status">
              <Select
                placeholder="Select status"
                options={[
                  { label: "Draft", value: "DRAFT" },
                  { label: "Ordered", value: "ORDERED" },
                ]}
              />
            </Form.Item>

            <Form.Item label="Shipping Cost" name="shippingCost">
              <InputNumber min={0}
                style={{
                  width: '100%'
                }}
              />
            </Form.Item>

            <Form.Item label="Note" name="note" className="md:col-span-2">
              <TextArea rows={3} placeholder="Urgent purchase" />
            </Form.Item>
          </div>

          <Space className="mt-6">
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              Update Purchase Order
            </Button>
          </Space>
        </Form>
      </Card>
    </div>
  );
};

export default UpdatePurchaseOrder;
