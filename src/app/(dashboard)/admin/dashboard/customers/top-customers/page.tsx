"use client";
import React from 'react';
import CustomersCard from './_components/CustomersCard';
import CustomersChart from './_components/customersChart';
import TopCustomersTable from './_components/TopCustomersTable';

const TopCustomers = () => {
    return (
        <div>
            Top Customers
            <CustomersCard />

            {/* chart */}
            <CustomersChart />

            {/* Table */}
            <TopCustomersTable ></TopCustomersTable>
        </div>
    );
};

export default TopCustomers;