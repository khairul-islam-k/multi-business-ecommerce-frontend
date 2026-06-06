"use client";
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { App, Button, Modal, Popconfirm, Tag } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import CreateAttributesPage from './_components/attributes-page';
import { useAttributeMutation, useProductAttributeQuery } from '@/lib/api/hooks/product-attribute';
import { useAuthStore } from '@/stores/auth.store';
import { Column, DataTable } from '@/components/shared/data-table';
import { ResponseProductAttribute } from '@/types/product/attribute';
import { getApiErrorMessage } from '@/lib/axios';
import UpdateAttributesPage from './_components/update-attribute-page';
import ViewAttribute from './_components/view-attribute';


export type UpdateAttributeName = {
    id: string;
    name: string;
    status: "ACTIVE" | "INACTIVE";
}

const AttributesPage = () => {
    const { message } = App.useApp();
    // modata
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [productKey, setProductKey] = useState<string>('');
    const [updateAttribute, setUpdateAttribute] = useState<UpdateAttributeName>();
    const [attributeId, setAttributeId] = useState<string>('');
    // product
    const business = useAuthStore(s => s.selectedBusiness);
    const businessId = business?.id ? business?.id : '';


    // search
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [search, setSearch] = useState("");
    const limit = 5;

    const {
        data: attributes,
        isLoading,
        isFetching,
    } = useProductAttributeQuery(businessId, {
        page: currentPage,
        limit,
        search,
        sortOrder: "desc",
    });


    const total = attributes?.meta?.total || 0;
    const totalPages = Math.ceil(total / limit);

    const { removeAttributeName } = useAttributeMutation(businessId);

    const handleDelete = async (id: string) => {
        try {
            await removeAttributeName.mutateAsync(id);
            message.success('Deleted successfully');
        } catch (error) {
            message.error(getApiErrorMessage(error));
        }
    }

    const columns: Column<ResponseProductAttribute>[] = [
        {
            key: "name",
            label: "Attribute Name",
            type: "primary",
            render: (row) => <strong>{row.name}</strong>,
        },
        {
            key: "values",
            label: "Values",
            render: (row) =>
                row.values?.length ? (
                    <div className="grid grid-cols-3 gap-1">
                        {row.values.map((item) => (
                            <Tag key={item.id}>{item.value}</Tag>
                        ))}
                    </div>
                ) : (
                    "-"
                ),
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
            key: "valuesCount",
            label: "Total Values",
            render: (row) => row.values?.length ?? 0,
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
                        onClick={() => {
                            setIsModalOpen(true);
                            setProductKey('viewAttribute');
                            setAttributeId(row.id);
                        }}
                    />

                    <Button
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => {
                            setIsModalOpen(true);
                            setProductKey('updateAttribute');
                            setUpdateAttribute({
                                id: row.id,
                                name: row.name,
                                status: row.status
                            })
                        }}
                    />

                    <Popconfirm
                        title="Delete attribute?"
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
        <div>

            <DataTable
                data={attributes?.items ?? []}
                toolbarEnd={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setIsModalOpen(true);
                            setProductKey('createAttribute');
                        }}
                    >
                        New Attribute
                    </Button>
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

            <Modal
                title="Basic Modal"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalOpen}
                footer={null}
                onCancel={() => setIsModalOpen(false)}
            >
                {
                    productKey === "createAttribute" && <CreateAttributesPage
                        setIsModalOpen={setIsModalOpen}
                    />
                }
                {
                    productKey === "updateAttribute" && <UpdateAttributesPage
                        setIsModalOpen={setIsModalOpen}
                        initialValue={updateAttribute}
                    />
                }
                {
                    productKey === "viewAttribute" && <ViewAttribute
                        attributeId={attributeId}
                    />
                }
            </Modal>
        </div>
    );
};

export default AttributesPage;