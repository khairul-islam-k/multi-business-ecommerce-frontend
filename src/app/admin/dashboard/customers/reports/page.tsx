"use client";
import React from 'react';
import ReportChart from './_components/ReportChart';
import ReportCard from './_components/ReportCard';
import PageHeader from '@/components/shared/page-header';
import { adminBreadcrumb } from '@/config/breadcrumb.config';

const AcquisitionReports = () => {
    return (
        <div>
            <div style={{marginBottom: '24px'}}>
                <PageHeader title='Customer Acquisition Report' breadcrumb={adminBreadcrumb}></PageHeader>
            </div>
            <p>Analyze where your customers come from</p>

            <ReportCard />

            {/* chard */}
            <ReportChart />
        </div>
    );
};

export default AcquisitionReports;