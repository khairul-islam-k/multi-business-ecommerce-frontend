"use client";
import { useProductsQuery } from '@/lib/api/hooks/product';
import { useAuthStore } from '@/stores/auth.store';
import React from 'react';

const PosOrder = () => {
    const business = useAuthStore(s => s.selectedBusiness);
    const businessId = business?.id ? business?.id : '';
    const { data: products, isLoading, isFetching } = useProductsQuery(businessId, {
        sortOrder: "desc",
    });

    console.log('product', products);

    return (
        <div>
            Pos order
        </div>
    );
};

export default PosOrder;