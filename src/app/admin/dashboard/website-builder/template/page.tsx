"use client";
import PageHeader from '@/components/shared/page-header';
import { adminBreadcrumb } from '@/config/breadcrumb.config';
import React from 'react';
import GalleryCard from './_components/GalleryCard';


const Template = () => {
    return (
        <div>
            <div  style={{
                marginBottom: '24px'
            }}>
                <PageHeader title='Template Gallery' breadcrumb={adminBreadcrumb}></PageHeader>
            </div>

            <p>Choose a template to get started quickly</p>

            

            {/* Gallery */}
            <GalleryCard />
        </div>
    );
};

export default Template;