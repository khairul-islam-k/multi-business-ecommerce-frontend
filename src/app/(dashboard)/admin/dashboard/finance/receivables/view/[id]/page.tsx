"use client";

import Loader from "@/components/shared/loader";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useFinanceReceivable } from "@/lib/api/hooks/finance-payable-receivable";
import { useAuthStore } from "@/stores/auth.store";
import { ArrowLeftOutlined } from "@ant-design/icons";
import {
    Button,
    Card,
    Col,
    Descriptions,
    Empty,
    Row,
    Statistic,
    Tag,
    Typography,
} from "antd";
import { useParams, useRouter } from "next/navigation";

const { Title, Text } = Typography;

const formatMoney = (value?: string | number | null, currency = "BDT") => {
    const amount = Number(value ?? 0);
    return `${currency} ${amount.toLocaleString()}`;
};

const formatDate = (date?: string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleString();
};

const partyTypeLabel: Record<string, string> = {
    CUSTOMER: "Customer",
    SUPPLIER: "Supplier",
    COURIER: "Courier",
    PAYMENT_GATEWAY: "Payment Gateway",
    EMPLOYEE: "Employee",
    OTHER: "Other",
};

const sourceTypeLabel: Record<string, string> = {
    ORDER: "Order",
    INVOICE: "Invoice",
    SUPPLIER_INVOICE: "Supplier Invoice",
    SUPPLIER_PAYMENT: "Supplier Payment",
    SUPPLIER_RETURN: "Supplier Return",
    COURIER_RECEIVABLE: "Courier Receivable",
    COURIER_SETTLEMENT: "Courier Settlement",
    EXPENSE: "Expense",
    REFUND: "Refund",
    MANUAL: "Manual",
};

const statusColor: Record<string, string> = {
    PENDING: "orange",
    PARTIALLY_RECEIVED: "blue",
    RECEIVED: "green",
    CANCELLED: "red",
};

const ViewReceivablePage = () => {
    const router = useRouter();
    const { id } = useParams<{ id: string }>();

    const business = useAuthStore((s) => s.selectedBusiness);
    const businessId = business?.id ?? "";

    const {
        data: receivable,
        isLoading,
        isFetching,
    } = useFinanceReceivable(businessId, id);

    if (isLoading || isFetching) {
        return <Loader />;
    }

    if (!receivable) {
        return <Empty description="Receivable not found" />;
    }

    const totalAmount = Number(receivable.totalAmount ?? 0);
    const receivedAmount = Number(receivable.receivedAmount ?? 0);
    const dueAmount = totalAmount - receivedAmount;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Receivable Details"
                subtitle="View receivable amount, received status, source, and party information."
                breadcrumb={adminBreadcrumb}
            />

            <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
                Back
            </Button>

            <Card>
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <Title level={4} className="!mb-1">
                            {receivable.receivableNo}
                        </Title>

                        <Text type="secondary">
                            {partyTypeLabel[receivable.partyType] ?? receivable.partyType}{" "}
                            receivable
                        </Text>
                    </div>

                    <Tag color={statusColor[receivable.status] ?? "default"}>
                        {receivable.status}
                    </Tag>
                </div>
            </Card>

            <Row gutter={[16, 16]}>
                <Col xs={24} md={6}>
                    <Card>
                        <Text type="secondary">Total Amount</Text>
                        <Title style={{ marginTop: 0 }} level={4}>
                            {formatMoney(receivable.totalAmount)}
                        </Title>
                    </Card>
                </Col>

                <Col xs={24} md={6}>
                    <Card>
                        <Text type="secondary">Received Amount</Text>
                        <Title style={{ marginTop: 0 }} level={4}>
                            {formatMoney(receivable.receivedAmount)}
                        </Title>
                    </Card>
                </Col>

                <Col xs={24} md={6}>
                    <Card>
                        <Text type="secondary">Due Amount</Text>
                        <Title style={{ marginTop: 0 }} level={4}>
                            {formatMoney(dueAmount)}
                        </Title>
                    </Card>
                </Col>

                <Col xs={24} md={6}>
                    <Card>
                        <Text type="secondary">Status</Text>
                        <Title style={{ marginTop: 0 }} level={4}>
                            {receivable.status}
                        </Title>
                    </Card>
                </Col>
            </Row>

            <Card title="Receivable Information">
                <Descriptions bordered column={{ xs: 1, md: 2 }}>
                    <Descriptions.Item label="Receivable No">
                        {receivable.receivableNo}
                    </Descriptions.Item>

                    <Descriptions.Item label="Status">
                        <Tag color={statusColor[receivable.status] ?? "default"}>
                            {receivable.status}
                        </Tag>
                    </Descriptions.Item>

                    <Descriptions.Item label="Party Type">
                        {partyTypeLabel[receivable.partyType] ?? receivable.partyType}
                    </Descriptions.Item>

                    <Descriptions.Item label="Party ID">
                        {receivable.partyId}
                    </Descriptions.Item>

                    <Descriptions.Item label="Source Type">
                        {sourceTypeLabel[receivable.sourceType] ?? receivable.sourceType}
                    </Descriptions.Item>

                    <Descriptions.Item label="Source ID">
                        {receivable.sourceId}
                    </Descriptions.Item>

                    <Descriptions.Item label="Total Amount">
                        {formatMoney(receivable.totalAmount)}
                    </Descriptions.Item>

                    <Descriptions.Item label="Received Amount">
                        {formatMoney(receivable.receivedAmount)}
                    </Descriptions.Item>

                    <Descriptions.Item label="Due Amount">
                        {formatMoney(dueAmount)}
                    </Descriptions.Item>

                    <Descriptions.Item label="Due Date">
                        {formatDate(receivable.dueDate)}
                    </Descriptions.Item>

                    <Descriptions.Item label="Created At">
                        {formatDate(receivable.createdAt)}
                    </Descriptions.Item>

                    <Descriptions.Item label="Updated At">
                        {formatDate(receivable.updatedAt)}
                    </Descriptions.Item>

                    <Descriptions.Item label="Note" span={2}>
                        {receivable.note || "-"}
                    </Descriptions.Item>
                </Descriptions>
            </Card>
        </div>
    );
};

export default ViewReceivablePage;