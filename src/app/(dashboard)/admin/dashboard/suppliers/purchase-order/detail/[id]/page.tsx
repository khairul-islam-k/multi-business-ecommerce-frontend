"use client";

import {
  App,
  Button,
  Card,
  Col,
  Empty,
  Flex,
  Modal,
  Row,
  Table,
  Tag,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import Loader from "@/components/shared/loader";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import {
  usePurchaseOrder,
  usePurchaseOrderMutation,
} from "@/lib/api/hooks/purchase-order";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";

const PurchaseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { message, modal } = App.useApp();
  const router = useRouter();

  // modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [note, setNote] = useState<string>("");
  const [mode, setMode] = useState<string>("");

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const {
    data: purchase,
    isLoading,
    isFetching,
  } = usePurchaseOrder(businessId, id);

  console.log("status", purchase);
  const cancelOrReceiveStatus = !(
    purchase?.status === "CANCELLED" || purchase?.status === "RECEIVED"
  );

  const receiveStatus = purchase?.status === "RECEIVED";

  const { updateReceivePO, updateCancelPO } =
    usePurchaseOrderMutation(businessId);

  const handleReceivePO = async (id: string) => {
    const payload = { note };
    try {
      const res = await updateReceivePO.mutateAsync({
        purchaseId: id,
        payload,
      });
      console.log("res", res);
      message.success("Purchase order have been received");
    } catch (error) {
      message.error(getApiErrorMessage(error));
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleCancel = async (id: string) => {
    const payload = { note };
    console.log("can", payload, id);
    try {
      const res = await updateCancelPO.mutateAsync({
        purchaseId: id,
        payload,
      });
      console.log("res", res);
      message.success("Purchase order have been cancel");
    } catch (error) {
      message.error(getApiErrorMessage(error));
    } finally {
      setIsModalOpen(false);
    }
  };

  if (isLoading || isFetching) {
    return <Loader />;
  }

  if (!purchase) {
    return <Empty description="Purchase order not found" />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchase Order Details"
        subtitle="View purchase order, supplier, items, tax, and payment summary."
        breadcrumb={adminBreadcrumb}
      />

      <Flex justify="end" gap={10} wrap>
        {receiveStatus && (
          <Button
            type="primary"
            danger
            onClick={() =>
              router.push(
                `/admin/dashboard/suppliers/purchase-order/return-request/${purchase.id}`,
              )
            }
          >
            Return Request
          </Button>
        )}

        {cancelOrReceiveStatus && (
          <Button
            type="primary"
            onClick={() => {
              setIsModalOpen(true);
              setMode("receive");
            }}
          >
            Receive PO
          </Button>
        )}

        {cancelOrReceiveStatus && (
          <Button
            danger
            onClick={() => {
              setIsModalOpen(true);
              setMode("cancel");
            }}
          >
            Cancel PO
          </Button>
        )}
      </Flex>

      <Card>
        <Flex justify="space-between" align="center" wrap gap={12}>
          <div>
            <h2 className="m-0 text-xl font-semibold">
              {purchase.purchaseOrderNo}
            </h2>
            <p className="m-0 text-gray-500">{purchase.note || "No note"}</p>
          </div>

          <Tag color={purchase.status === "CANCELLED" ? "red" : "green"}>
            {purchase.status}
          </Tag>
        </Flex>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Order Information">
            <InfoItem
              label="Order Date"
              value={formatDate(purchase.orderDate)}
            />
            <InfoItem
              label="Expected Delivery"
              value={formatDate(purchase.expectedDeliveryDate)}
            />
            <InfoItem label="Warehouse ID" value={purchase.warehouseId} />
            <InfoItem label="Tax Rate" value={`${purchase.taxRate}%`} />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Supplier Information">
            <InfoItem label="Name" value={purchase.supplier?.name ?? "-"} />
            <InfoItem
              label="Company"
              value={purchase.supplier?.companyName ?? "-"}
            />
            <InfoItem label="Email" value={purchase.supplier?.email ?? "-"} />
            <InfoItem label="Phone" value={purchase.supplier?.phone ?? "-"} />
            <InfoItem
              label="Address"
              value={
                purchase.supplier
                  ? `${purchase.supplier.address}, ${purchase.supplier.city}, ${purchase.supplier.country}`
                  : "-"
              }
            />
          </Card>
        </Col>
      </Row>

      <Card title="Purchase Items">
        <Table
          rowKey="id"
          pagination={false}
          dataSource={purchase.items ?? []}
          columns={[
            {
              title: "Product",
              dataIndex: "productId",
              render: (_, row) => row.product.name,
            },
            {
              title: "Variant",
              dataIndex: "variantId",
              render: (_, row) => row.variant?.title || "-",
            },
            {
              title: "Qty Ordered",
              dataIndex: "quantityOrdered",
            },
            {
              title: "Qty Received",
              dataIndex: "quantityReceived",
            },
            {
              title: "Unit Cost",
              dataIndex: "unitCost",
              render: (value) => money(value),
            },
            {
              title: "Discount",
              dataIndex: "discountAmount",
              render: (value) => money(value),
            },
            {
              title: "Tax",
              dataIndex: "taxAmount",
              render: (value) => money(value),
            },
            {
              title: "Line Total",
              dataIndex: "lineTotal",
              render: (value) => money(value),
            },
          ]}
        />
      </Card>

      <Card title="Payment Summary">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8} lg={4}>
            <InfoItem label="Subtotal" value={money(purchase.subtotal)} />
          </Col>

          <Col xs={24} md={8} lg={4}>
            <InfoItem label="Discount" value={money(purchase.discountTotal)} />
          </Col>

          <Col xs={24} md={8} lg={4}>
            <InfoItem label="Tax" value={money(purchase.taxTotal)} />
          </Col>

          <Col xs={24} md={8} lg={4}>
            <InfoItem label="Shipping" value={money(purchase.shippingCost)} />
          </Col>

          <Col xs={24} md={8} lg={4}>
            <InfoItem label="Total" value={money(purchase.totalAmount)} />
          </Col>
        </Row>
      </Card>

      <Card title="Tax Information">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <InfoItem label="Tax Name" value={purchase.tax?.name ?? "-"} />
          </Col>

          <Col xs={24} md={12}>
            <InfoItem
              label="Tax Rate"
              value={purchase.tax?.rate ? `${purchase.tax.rate}%` : "-"}
            />
          </Col>

          <Col xs={24}>
            <InfoItem
              label="Description"
              value={purchase.tax?.description ?? "-"}
            />
          </Col>
        </Row>
      </Card>

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        {mode === "receive" && (
          <>
            <Card title="Receive Purchase Order">
              <TextArea
                rows={4}
                placeholder="Write purchase order note..."
                showCount
                maxLength={500}
                onChange={(e) => {
                  setNote(e.target.value);
                }}
              />

              <Button
                type="primary"
                style={{
                  marginTop: "8px",
                }}
                onClick={() => {
                  handleReceivePO(purchase.id);
                }}
              >
                Receive PO
              </Button>
            </Card>
          </>
        )}

        {/* cancel */}
        {mode === "cancel" && (
          <>
            <Card title="Cancel Purchase Order">
              <TextArea
                rows={4}
                placeholder="Write purchase order note..."
                showCount
                maxLength={500}
                onChange={(e) => {
                  setNote(e.target.value);
                }}
              />

              <Button
                type="primary"
                style={{
                  marginTop: "8px",
                }}
                onClick={() => {
                  handleCancel(purchase.id);
                }}
              >
                Cancel PO
              </Button>
            </Card>
          </>
        )}
      </Modal>
    </div>
  );
};

export default PurchaseDetail;

type InfoItemProps = {
  label: string;
  value: React.ReactNode;
};

const InfoItem = ({ label, value }: InfoItemProps) => {
  return (
    <div className="mb-3 rounded-lg border bg-gray-50 p-4">
      <p className="mb-1 text-sm text-gray-500">{label}</p>
      <div className="break-all font-medium">{value}</div>
    </div>
  );
};

const formatDate = (date?: string | null) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString();
};

const money = (value?: string | number | null) => {
  if (value === null || value === undefined) return "0";

  return Number(value).toLocaleString();
};
