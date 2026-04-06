"use client";
import PageHeader from '@/components/shared/page-header';
import { adminBreadcrumb } from '@/config/breadcrumb.config';
import React from 'react';
import MainNavigation from './_components/MainNavigation';

const MenuBuilder = () => {
    return (
        <div>
            <div>
                <PageHeader title='Menu Builder' breadcrumb={adminBreadcrumb}></PageHeader>
            </div>

            <p>Configure website navigation menus</p>

            {/* <MainNavigation /> */}

        </div>
    );
};

export default MenuBuilder;