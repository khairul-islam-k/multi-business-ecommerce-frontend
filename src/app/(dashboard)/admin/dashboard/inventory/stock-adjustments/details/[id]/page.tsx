"use client";

import {
  ArrowLeft,
  CircleCheck,
  CircleX
} from "lucide-react";


import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useStockAdjustment } from "@/lib/api/hooks/stock-adjustment";
import { useAuthStore } from "@/stores/auth.store";
import { StockAdjustmentResponse } from "@/types/stock/adjustment";
// import type { StockAdjustmentResponse } from "@/types/stock-adjustment/stock-adjustment";
import {
    Button,
    Card,
    Descriptions,
    Empty,
    Space,
    Spin,
    Table,
    Tag,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useParams, useRouter } from "next/navigation";

type AdjustmentItemRow = {
    serial: number;
    oldQuantity: string;
    adjustmentQty: string;
    newQuantity: number;
    reason: string | null;
    createdAt: string;
};

const statusColor: Record<string, string> = {
    DRAFT: "default",
    PENDING: "blue",
    APPROVED: "green",
    REJECTED: "red",
    CANCELLED: "orange",
};

const adjustmentTypeColor: Record<string, string> = {
    INCREASE: "green",
    DECREASE: "red",
};

const formatDate = (date?: string | null) => {
    if (!date) return "-";

    return new Date(date).toLocaleString();
};

const getNewQuantity = (
    oldQuantity: string,
    adjustmentQty: string,
    adjustmentType: string,
) => {
    const oldQty = Number(oldQuantity ?? 0);
    const adjustQty = Number(adjustmentQty ?? 0);

    if (adjustmentType === "INCREASE") {
        return oldQty + adjustQty;
    }

    return oldQty - adjustQty;
};

const AdjustmentDetails = () => {
    const router = useRouter();
    const { id } = useParams<{ id: string }>();

    const business = useAuthStore((s) => s.selectedBusiness);
    const businessId = business?.id ?? "";

    const {
        data: adjustment,
        isLoading,
        isFetching,
    } = useStockAdjustment(businessId, id) as {
        data?: StockAdjustmentResponse;
        isLoading: boolean;
        isFetching: boolean;
    };

    const tableData: AdjustmentItemRow[] =
        adjustment?.items?.map((item, index) => ({
            serial: index + 1,
            oldQuantity: item.oldQuantity,
            adjustmentQty: item.adjustmentQty,
            newQuantity: getNewQuantity(
                item.oldQuantity,
                item.adjustmentQty,
                adjustment.adjustmentType,
            ),
            reason: item.reason,
            createdAt: item.createdAt,
        })) ?? [];

    const columns: ColumnsType<AdjustmentItemRow> = [
        {
            title: "SL",
            dataIndex: "serial",
            key: "serial",
            width: 70,
        },
        {
            title: "Old Quantity",
            dataIndex: "oldQuantity",
            key: "oldQuantity",
            render: (value) => Number(value ?? 0),
        },
        {
            title: "Adjustment Quantity",
            dataIndex: "adjustmentQty",
            key: "adjustmentQty",
            render: (value) => Number(value ?? 0),
        },
        {
            title: "New Quantity",
            dataIndex: "newQuantity",
            key: "newQuantity",
            render: (value) => Number(value ?? 0),
        },
        {
            title: "Reason",
            dataIndex: "reason",
            key: "reason",
            render: (value) => value || "-",
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (value) => formatDate(value),
        },
    ];

    if (isLoading || isFetching) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }

    if (!adjustment) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Stock Adjustment Details"
                    subtitle="View stock adjustment information, warehouse details, status, quantities, and item reasons."
                    breadcrumb={adminBreadcrumb}
                />

                <Card>
                    <Empty description="Stock adjustment not found" />
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Stock Adjustment Details"
                subtitle="View stock adjustment information, warehouse details, status, quantities, and item reasons."
                breadcrumb={adminBreadcrumb}
            />

            <Button icon={<ArrowLeft />} onClick={() => router.back()}>
                Back
            </Button>

            <Card
                title="Adjustment Information"
                extra={
                    <Space>
                        <Tag color={adjustmentTypeColor[adjustment.adjustmentType]}>
                            {adjustment.adjustmentType}
                        </Tag>

                        <Tag color={statusColor[adjustment.status]}>
                            {adjustment.status}
                        </Tag>
                    </Space>
                }
            >
                <Descriptions bordered column={{ xs: 1, md: 2 }}>
                    <Descriptions.Item label="Adjustment No">
                        {adjustment.adjustmentNo}
                    </Descriptions.Item>

                    <Descriptions.Item label="Status">
                        <Tag color={statusColor[adjustment.status]}>
                            {adjustment.status}
                        </Tag>
                    </Descriptions.Item>

                    <Descriptions.Item label="Adjustment Type">
                        <Tag color={adjustmentTypeColor[adjustment.adjustmentType]}>
                            {adjustment.adjustmentType}
                        </Tag>
                    </Descriptions.Item>

                    <Descriptions.Item label="Warehouse">
                        {adjustment.warehouse?.name ?? "-"}
                    </Descriptions.Item>

                    <Descriptions.Item label="Warehouse Phone">
                        {adjustment.warehouse?.phone ?? "-"}
                    </Descriptions.Item>

                    <Descriptions.Item label="Warehouse Address">
                        {adjustment.warehouse?.address ?? "-"}
                    </Descriptions.Item>

                    <Descriptions.Item label="Reason" span={2}>
                        {adjustment.reason || "-"}
                    </Descriptions.Item>

                    <Descriptions.Item label="Created At">
                        {formatDate(adjustment.createdAt)}
                    </Descriptions.Item>

                    <Descriptions.Item label="Updated At">
                        {formatDate(adjustment.updatedAt)}
                    </Descriptions.Item>

                    <Descriptions.Item label="Approved At">
                        {formatDate(adjustment.approvedAt)}
                    </Descriptions.Item>

                    <Descriptions.Item label="Approval Status">
                        {adjustment.approvedAt ? (
                            <Tag icon={<CircleCheck />} color="green">
                                Approved
                            </Tag>
                        ) : (
                            <Tag icon={<CircleX />} color="default">
                                Not Approved
                            </Tag>
                        )}
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            <Card title="Adjustment Items">
                <Table
                    rowKey={(row) => String(row.serial)}
                    columns={columns}
                    dataSource={tableData}
                    pagination={false}
                    scroll={{ x: true }}
                />
            </Card>
        </div>
    );
};

export default AdjustmentDetails;