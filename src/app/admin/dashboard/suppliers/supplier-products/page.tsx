"use client"
import React from 'react';
import SupplierProductsTable from './_components/SupplierProductsTable';
import PageHeader from '@/components/shared/page-header';
import { adminBreadcrumb } from '@/config/breadcrumb.config';

const SupplierProducts = () => {
    return (
        <div>
            <div style={{marginBottom: '24px'}}>
                <PageHeader title="Supplier Products" breadcrumb={adminBreadcrumb}></PageHeader>
            </div>

            <p>Products sourced from suppliers</p>
            
            <SupplierProductsTable />
        </div>
    );
};

export default SupplierProducts;