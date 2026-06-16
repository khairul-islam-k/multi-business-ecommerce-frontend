'use client';
import React, { useState } from 'react';
import ExpenseForm from '../../_components/expense-form';
import { getApiErrorMessage } from '@/lib/axios';
import { ExpensePayload } from '@/types/stock/expense';
import { useExpenseMutation } from '@/lib/api/hooks/expense';
import { useRouter } from 'next/navigation';
import { useSwal } from '@/hooks/use-swal';
import { useAuthStore } from '@/stores/auth.store';

const expense = {
    accountId: "2d8d0f8f-95aa-4f23-a2fd-0ca6f5f8a913",
    expenseCategoryId: "2d8d0f8f-95aa-4f23-a2fd-0ca6f5f8a913",
    title: "Packaging materials",
    amount: 500,
    expenseDate: "2026-06-02T00:00:00.000Z",
    note: "Paid to local vendor",
};

const UpdateExpense = () => {
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
                initialData={expense}
                onSubmit={handleSubmit}
                loading={loading}
            />
        </div>
    );
};

export default UpdateExpense;