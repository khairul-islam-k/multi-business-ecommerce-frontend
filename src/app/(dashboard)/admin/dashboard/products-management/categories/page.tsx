"use client";
import { Column, DataTable } from '@/components/shared/data-table';
import PageHeader from '@/components/shared/page-header';
import { adminBreadcrumb } from '@/config/breadcrumb.config';
import { useProductCategoriesMutation, useProductCategoriesQuery } from '@/lib/api/hooks/product-categories';
import { useAuthStore } from '@/stores/auth.store';
import { ResponseCategory } from '@/types/product/product';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Select, Tag } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const imageUrlSet = (url: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;
    const image = `${baseUrl}${url}`;
    return image;
}

const Categories = () => {
    const router = useRouter();
    const [statusFilter, setStatusFilter] = useState<string | undefined>(
        undefined
    );
    const business = useAuthStore(s => s.selectedBusiness);
    const businessId = business?.id ? business?.id : "";
    const [search, setSearch] = useState<string>('');

    const [currentPage, setCurrentPage] = useState<number>(1)

    const {
        data: category,
        isLoading,
        isFetching,
    } = useProductCategoriesQuery(businessId, {
        page: currentPage,
        limit: 5,
        search,
        status: statusFilter,
        sortOrder: "desc",
    });

    const { removeCategories } = useProductCategoriesMutation(businessId);

    // pagination
    const total = category?.meta?.total || 0;
    const limit = 5;
    const totalPages = Math.ceil(total / limit);

    const handleDelete = async (id: string) => {
        console.log('id0', id);
        await removeCategories.mutateAsync(id);
    }

    const columns: Column<ResponseCategory>[] = [
        {
            key: "imageUrl",
            label: "Image",
            render: (row) =>
                row.imageUrl ? (
                    <Image
                        src={imageUrlSet(row.imageUrl)}
                        alt={row.name}
                        width={48}
                        height={48}
                        className="rounded-md object-cover"
                        unoptimized
                    />
                ) : (
                    "-"
                ),
        },
        {
            key: "name",
            label: "Name",
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
            label: "Children",
            render: (row) => row._count?.children ?? 0,
        },
        {
            key: "createdAt",
            label: "Created At",
            render: (row) => new Date(row.createdAt).toLocaleDateString(),
        },
        {
            key: "actions",
            label: "Actions",
            render: (row) => (
                <div className="flex items-center gap-2">

                    <Button
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => router.push(`/admin/dashboard/products-management/categories/view/${row.id}`)}
                    >
                    </Button>
                    <Button
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => router.push(`/admin/dashboard/products-management/categories/update/${row.id}`)}
                    >

                    </Button>

                    <Popconfirm
                        title="Delete category?"
                        description="Are you sure?"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() => handleDelete(row.id)}
                    >
                        <Button
                            icon={<DeleteOutlined />}
                            danger size="small">

                        </Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div className='space-y-6'>
            <PageHeader
                title="Product Categories"
                subtitle="Manage product categories, parent-child hierarchy, images, status, and sorting."
                breadcrumb={adminBreadcrumb}
            />

            <DataTable
                data={category?.items ?? []}
                toolbarEnd={
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between items-center gap-3 mb-4">
                        <div className="flex gap-3">

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
                        </div>

                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() =>
                                router.push("/admin/dashboard/products-management/categories/create")
                            }
                        >
                            New Categories
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

export default Categories;