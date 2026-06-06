"use client";
import { usePurchaseOrder } from "@/lib/api/hooks/purchase-order";
import { useAuthStore } from "@/stores/auth.store";
import { Card, Col, Flex, Row, Table } from "antd";
import { useParams } from "next/navigation";

const PurchaseDetail = () => {
  const { id } = useParams<{ id: string }>();

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const {data: purchase} = usePurchaseOrder(businessId, id);
  console.log('data', purchase);

  const purchaseOrder = {
    id: 2,
    "PO #": "PO-2026-002",
    Supplier: "BlueWear Ltd",
    Warehouse: "Central Warehouse",
    Date: "2026-03-03",
    Expected: "2026-03-12",
    Total: "Rs 85,500",
    Status: "pending",
    variant: "-",
    Qty: 150,
    product: "cotton-T-shirt",
    "Unit Cost": "RS 1200",
    createBy: "admin",
  };

  const dataSource = [purchaseOrder];
  const columns = [
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
    },
    {
      title: "variant",
      dataIndex: "variant",
      key: "variant",
    },
    {
      title: "QTY",
      dataIndex: "Qty",
      key: "Qty",
    },
    {
      title: "Unit Cost",
      dataIndex: "Unit Cost",
      key: "Unit Cost",
    },
    {
      title: "Total",
      dataIndex: "Total",
      key: "Total",
    },
  ];

  return (
    <div>
      details
    </div>
  );
};

export default PurchaseDetail;
