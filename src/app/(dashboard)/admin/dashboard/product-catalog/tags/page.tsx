"use client";
import { Column, DataTable } from '@/components/shared/data-table';
import PageHeader from '@/components/shared/page-header';
import { adminBreadcrumb } from '@/config/breadcrumb.config';
import { useSwal } from '@/hooks/use-swal';
import { useProductTagQuery, useTagsMutation } from '@/lib/api/hooks/product-tags';
import { getApiErrorMessage } from '@/lib/axios';
import { useAuthStore } from '@/stores/auth.store';
import { ResponseUnit } from '@/types/product/unit';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Select, Tag } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const ProductTags = () => {
    const router = useRouter();
    const business = useAuthStore(s => s.selectedBusiness);
    const businessId = business?.id ? business?.id : '';
    const swal = useSwal();

    const [statusFilter, setStatusFilter] = useState('');
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState<number>(1)
    const limit = 10;
    console.log('status', statusFilter);

    const { data: units, isLoading, isFetching } = useProductTagQuery(businessId, {
        page: currentPage,
        limit,
        search,
        status: statusFilter,
        sortOrder: "desc",
    });

    // pagination
    const total = units?.meta?.total || 0;
    const totalPages = Math.ceil(total / limit);

    const { removeTag } = useTagsMutation(businessId);

    const handleDelete = async (id: string) => {
        console.log('id', id);
        try {
            await removeTag.mutateAsync(id);
            swal.success("Tag delete successfully");
        } catch (error) {
            swal.error(getApiErrorMessage(error))
        }
    }

    const columns: Column<ResponseUnit>[] = [
        {
            key: "name",
            label: "Unit Name",
            type: "primary",
            render: (row) => <strong>{row.name}</strong>,
        },
        {
            key: "status",
            label: "Status",
            type: "meta",
            render: (row) => (
                <Tag color={row.status === "ACTIVE" ? "green" : "red"}>
                    {row.status}
                </Tag>
            ),
        },
        {
            key: "_count",
            label: "Products",
            render: (row) => row._count?.products ?? 0,
        },
        {
            key: "createdAt",
            label: "Created At",
            render: (row) => new Date(row.createdAt).toLocaleDateString(),
        },
        {
            key: "updatedAt",
            label: "Updated At",
            render: (row) => new Date(row.updatedAt).toLocaleDateString(),
        },
        {
            key: "actions",
            label: "Actions",
            render: (row) => (
                <div className="flex items-center gap-2">
                    <Button
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() =>
                            router.push(
                                `/admin/dashboard/product-catalog/tags/view/${row.id}`
                            )
                        }
                    />

                    <Button
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() =>
                            router.push(
                                `/admin/dashboard/product-catalog/tags/update/${row.id}`
                            )
                        }
                    />

                    <Popconfirm
                        title="Delete unit?"
                        description="Are you sure?"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() => handleDelete(row.id)}
                    >
                        <Button danger size="small" icon={<DeleteOutlined />} />
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div className='space-y-6'>

            <PageHeader
                title="Product Tags"
                subtitle="Manage product tags for organizing, filtering, and grouping products."
                breadcrumb={adminBreadcrumb}
            />

            <DataTable
                data={units?.items ?? []}
                toolbarEnd={
                    <div className="flex flex-col gap-3 md:flex-row">
                        <Select
                            placeholder="Filter by status"
                            allowClear
                            style={{ width: 180 }}
                            onChange={(v) => setStatusFilter(v)}
                            options={[
                                { label: "Active", value: "ACTIVE" },
                                { label: "Inactive", value: "INACTIVE" },
                            ]}
                        />

                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() =>
                                router.push("/admin/dashboard/product-catalog/tags/create")
                            }
                        >
                            New Tags
                        </Button>
                    </div>
                }
                columns={columns}
                onSearch={(value) => {
                    setSearch(value);
                }}
                loading={
                    isLoading ||
                    isFetching
                }
                pagination={{
                    currentPage,
                    onPageChange: setCurrentPage,
                    totalPages: totalPages,
                }}
            />
        </div>
    );
};

export default ProductTags;