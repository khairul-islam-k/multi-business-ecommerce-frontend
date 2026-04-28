"use client";
import React from 'react';
import PurchaseProductTable from './_components/PurchaseProductTable';
import PageHeader from '@/components/shared/page-header';
import { adminBreadcrumb } from '@/config/breadcrumb.config';

const PurchaseOrder = () => {

    return (
        <div>

            <div style={{marginBottom: '24px'}}>
                <PageHeader title='Purchase Orders' breadcrumb={adminBreadcrumb}></PageHeader>
            </div>

            <p>Manage procurement orders</p>
            
            <PurchaseProductTable />
        </div>
    );
};

export default PurchaseOrder;