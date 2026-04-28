"use client";
import { DollarOutlined } from '@ant-design/icons';
import { Card, theme } from 'antd';
import React from 'react';
import PaymentTable from './_component/PaymentTable';
import PageHeader from '@/components/shared/page-header';
import { adminBreadcrumb } from '@/config/breadcrumb.config';


const SupplierPayments = () => {
    const { token } = theme.useToken();


    return (
        <div>
            <div style={{marginBottom: '24px'}}>
                <PageHeader title='Supplier Payments' breadcrumb={adminBreadcrumb}></PageHeader>
            </div>
            <p>Track payments to suppliers</p>

            {/* card */}
            <Card>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                        background: token.colorBgContainerDisabled,
                        height: '50px',
                        width: '50px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '10px'
                    }}>
                        <DollarOutlined style={{ fontSize: '30px' }} />
                    </div>
                    <div>
                        <h3 style={{
                            fontSize: '20px',
                            marginBottom: 0!,
                            fontWeight: 'bold'
                        }}>Rs 311,100</h3>
                        <p>Total payments</p>
                    </div>
                </div>
            </Card>

            <PaymentTable />
        </div>
    );
};

export default SupplierPayments;