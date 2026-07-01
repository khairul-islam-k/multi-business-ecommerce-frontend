'use client';
import { useTemplateOrder } from '@/lib/api/hooks/template-order-history';
import { useParams } from 'next/navigation';
import React from 'react';

const FashionOrderDetail = () => {
    const {orderId} = useParams<{orderId: string}>();

    const {data: details} = useTemplateOrder(orderId);
    console.log('data', details);

    return (
        <div>
            order Detail
        </div>
    );
};

export default FashionOrderDetail;