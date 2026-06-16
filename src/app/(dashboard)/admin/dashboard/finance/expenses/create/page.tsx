'use client';
import React, { useState } from 'react';
import ExpenseForm from '../_components/expense-form';
import { useAuthStore } from '@/stores/auth.store';
import { useExpenseMutation } from '@/lib/api/hooks/expense';
import { useSwal } from '@/hooks/use-swal';
import { getApiErrorMessage } from '@/lib/axios';
import { ExpensePayload } from '@/types/stock/expense';
import { useRouter } from 'next/navigation';

const ExpenseCreate = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const business = useAuthStore((s) => s.selectedBusiness);
    const businessId = business?.id ?? "";
    const swal = useSwal();
    const router = useRouter();

    const { createExpense } = useExpenseMutation(businessId);

    const handleSubmit = async (values: ExpensePayload) => {
        setLoading(true);

        try {
            const res = await createExpense.mutateAsync(values);
            console.log('res', res);
            router.push('/admin/dashboard/finance/expenses/');
            swal.success("Expense created successfully.");
        } catch (error) {
            swal.error(getApiErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <ExpenseForm
                onSubmit={handleSubmit}
                loading={loading}
            />
        </div>
    );
};

export default ExpenseCreate;