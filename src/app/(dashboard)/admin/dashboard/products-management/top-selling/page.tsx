"use client";
import React from 'react';
import SellingOverviewCard from './_components/SellingOverviewCard';
import PageHeader from '@/components/shared/page-header';
import { adminBreadcrumb } from '@/config/breadcrumb.config';
import TopSellingTable from './_components/TopSellingTable';
import SellingCart from './_components/SellingCart';

const TopSelling = () => {

    return (
        <div>
            <div style={{marginBottom: '24px'}}>
                <PageHeader title='Top Selling Products' breadcrumb={adminBreadcrumb}></PageHeader>
            </div>

            <SellingOverviewCard />

            <SellingCart />
            
            {/* Table */}
            <TopSellingTable />

        </div>
    );
};

export default TopSelling;