"use client";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { usePurchaseOrderQuery } from "@/lib/api/hooks/purchase-order";
import { useAuthStore } from "@/stores/auth.store";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import Link from "next/link";

const PurchaseOrder = () => {
  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";
  const {data: purchaseOrder} = usePurchaseOrderQuery(businessId);
  console.log('data', purchaseOrder);

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <PageHeader
          title="Purchase Orders"
          breadcrumb={adminBreadcrumb}
        ></PageHeader>
      </div>

      <p>Manage procurement orders</p>

      <Link href="/admin/dashboard/suppliers/purchase-order/create">
        <Button type="primary" icon={<PlusOutlined />}>
          Create PO
        </Button>
      </Link>
    </div>
  );
};

export default PurchaseOrder;
