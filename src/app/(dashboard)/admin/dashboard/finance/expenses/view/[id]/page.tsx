"use client";
import { useExpense } from '@/lib/api/hooks/expense';
import { useAuthStore } from '@/stores/auth.store';
import { useParams } from 'next/navigation';
import React from 'react';

const ViewExpense = () => {
    const { id } = useParams<{ id: string }>();
    const business = useAuthStore((s) => s.selectedBusiness);
    const businessId = business?.id ?? "";

    const {data: expense} = useExpense(businessId, id);

    console.log('data', expense);


    return (
        <div>
            View
        </div>
    );
};

export default ViewExpense;