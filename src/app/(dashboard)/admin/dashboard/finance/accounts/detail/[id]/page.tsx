"use client";

import {
  ArrowLeft
} from "lucide-react";


import Loader from "@/components/shared/loader";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useFinanceAccount } from "@/lib/api/hooks/finance-account";
import { useAuthStore } from "@/stores/auth.store";
import { Button, Card, Col, Descriptions, Empty, Row, Statistic, Tag, Typography } from "antd";
import { useParams, useRouter } from "next/navigation";

const { Title, Text } = Typography;

const accountTypeLabel: Record<string, string> = {
    CASH: "Cash",
    BANK: "Bank",
    MOBILE_BANKING: "Mobile Banking",
    PAYMENT_GATEWAY: "Payment Gateway",
    OTHER: "Other",
};

const formatMoney = (value?: string | number | null, currency = "BDT") => {
    const amount = Number(value ?? 0);
    return `${currency} ${amount.toLocaleString()}`;
};

const formatDate = (date?: string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleString();
};

const AccountDetails = () => {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const business = useAuthStore((s) => s.selectedBusiness);
    const businessId = business?.id ?? "";

    const {
        data: finance,
        isLoading,
        isFetching,
    } = useFinanceAccount(businessId, id);

    if (isLoading || isFetching) {
        return <Loader />;
    }

    if (!finance) {
        return <Empty description="Account not found" />;
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Account Details"
                subtitle="View finance account balance, type, status, and usage information."
                breadcrumb={adminBreadcrumb}
            />

            <Button icon={<ArrowLeft />} 
            onClick={() => router.back()}
            >
                Back
            </Button>

            <Card>
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <Title level={4} className="!mb-1">
                            {finance.name}
                        </Title>

                        <Text type="secondary">{finance.accountNumber}</Text>
                    </div>

                    <Tag color={finance.status === "ACTIVE" ? "green" : "red"}>
                        {finance.status}
                    </Tag>
                </div>
            </Card>

            <Row gutter={[16, 16]}>
                <Col xs={24} md={6}>
                    <Card>
                        <Statistic
                            title="Current Balance"
                            value={formatMoney(finance.currentBalance, finance.currencyCode)}
                        />
                    </Card>
                </Col>

                <Col xs={24} md={6}>
                    <Card>
                        <Statistic
                            title="Opening Balance"
                            value={formatMoney(finance.openingBalance, finance.currencyCode)}
                        />
                    </Card>
                </Col>

                <Col xs={24} md={6}>
                    <Card>
                        <Statistic
                            title="Transactions"
                            value={finance._count?.transactions ?? 0}
                        />
                    </Card>
                </Col>

                <Col xs={24} md={6}>
                    <Card>
                        <Statistic
                            title="Expenses"
                            value={finance._count?.expenses ?? 0}
                        />
                    </Card>
                </Col>
            </Row>

            <Card title="Account Information">
                <Descriptions bordered column={{ xs: 1, md: 2 }}>
                    <Descriptions.Item label="Account Name">
                        {finance.name}
                    </Descriptions.Item>

                    <Descriptions.Item label="Account Type">
                        {accountTypeLabel[finance.accountType] ?? finance.accountType}
                    </Descriptions.Item>

                    <Descriptions.Item label="Account Number">
                        {finance.accountNumber}
                    </Descriptions.Item>

                    <Descriptions.Item label="Currency">
                        {finance.currencyCode}
                    </Descriptions.Item>

                    <Descriptions.Item label="Opening Balance">
                        {formatMoney(finance.openingBalance, finance.currencyCode)}
                    </Descriptions.Item>

                    <Descriptions.Item label="Current Balance">
                        {formatMoney(finance.currentBalance, finance.currencyCode)}
                    </Descriptions.Item>

                    <Descriptions.Item label="Status">
                        <Tag color={finance.status === "ACTIVE" ? "green" : "red"}>
                            {finance.status}
                        </Tag>
                    </Descriptions.Item>

                    <Descriptions.Item label="Business ID">
                        {finance.businessId}
                    </Descriptions.Item>

                    <Descriptions.Item label="Created At">
                        {formatDate(finance.createdAt)}
                    </Descriptions.Item>

                    <Descriptions.Item label="Updated At">
                        {formatDate(finance.updatedAt)}
                    </Descriptions.Item>

                    <Descriptions.Item label="Created By">
                        {finance.createdBy}
                    </Descriptions.Item>

                    <Descriptions.Item label="Updated By">
                        {finance.updatedBy}
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            <Card title="Usage Summary">
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={8}>
                        <Card size="small">
                            <Statistic
                                title="Transactions"
                                value={finance._count?.transactions ?? 0}
                            />
                        </Card>
                    </Col>

                    <Col xs={24} md={8}>
                        <Card size="small">
                            <Statistic
                                title="Expenses"
                                value={finance._count?.expenses ?? 0}
                            />
                        </Card>
                    </Col>

                    <Col xs={24} md={8}>
                        <Card size="small">
                            <Statistic
                                title="Order Payments"
                                value={finance._count?.orderPayments ?? 0}
                            />
                        </Card>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default AccountDetails;