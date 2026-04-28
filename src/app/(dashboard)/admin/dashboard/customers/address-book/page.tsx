"use client";
import React from 'react';
import AddressTabla from './_components/AddressTabla';
import PageHeader from '@/components/shared/page-header';
import { adminBreadcrumb } from '@/config/breadcrumb.config';

const AddressBook = () => {
    return (
        <div>

            <div style={{marginBottom: '24px'}}>
                <PageHeader title='Customer Address Book' breadcrumb={adminBreadcrumb}></PageHeader>
            </div>

            <p>All customer shipping addresses</p>
            
            <AddressTabla />
        </div>
    );
};

export default AddressBook;