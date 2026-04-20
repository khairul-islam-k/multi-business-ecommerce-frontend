"use client";

import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, Flex, Grid, Input, Select, Space } from "antd";
import { useState } from "react";
import VariantHeader from "./components/VariantHeader";
import VariantTable from "./components/VariantTable";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import api from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export type TVariant = {
    id: number;
    uuid: string;
    name: string;
    slug: string;
    sku: string;
    barcode: string;

    cost_price: number;
    sale_price: number;
    margin: number;

    stock: number;
    stock_alert: "Normal" | "Low Stock" | "Out of Stock";

    color?: string;

    power?: string;
    capacity?: string;
    plug_type?: string;
    connectivity?: string;
    dpi?: string;
    length?: string;
    material?: string;
    layout?: string;
    fast_charge?: boolean;
};

const { Option } = Select;

const VariantManagement = () => {
    const screens = Grid.useBreakpoint();
    const router = useRouter();
    const [search, setSearch] = useState("");
    const queryClient = useQueryClient();

    const {
        data: variants,
    } = useQuery({
        queryKey: ["products"],
        queryFn: async () =>
            api.get<{ data: TVariant[] }>(
                `/variant`
            ),
    });

    // deleted
    const deleteVariant = useMutation({
        mutationFn: async (id: string) => {
            return api.delete(`/variant/${id}`);
        },

        onSuccess: () => {
            // refresh product list after delete
            Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
            });
            queryClient.invalidateQueries({
                queryKey: ["products"],
            });
        },
    });

    const handleDelete = (id: string) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteVariant.mutate(id);
            }
        });
    }


    return (
        <div>

            {/* header */}
            <div style={{ marginBottom: '24px' }}>
                <PageHeader title='Product Variant Manager' breadcrumb={adminBreadcrumb}></PageHeader>
            </div>

            <p>Manage SKUs, pricing, and stock levels across all product variants.</p>

            {/* <VariantHeader /> */}

            <Card title='All Variants'>
                <Flex justify="space-between" wrap="wrap" style={{ marginBottom: 16 }}>
                    <Space>
                        <Input
                            allowClear
                            prefix={<SearchOutlined />}
                            placeholder="Search products..."
                            style={{ width: screens.lg ? 330 : "100%" }}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </Space>

                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() =>
                            router.push(
                                "/admin/dashboard/products-management/variant/variant-create"
                            )
                        }
                    >
                        create variant
                    </Button>
                </Flex>

                {/* Table */}
                <VariantTable 
                handleDelete={handleDelete}
                tableData={variants?.data?.data ?? []} />

            </Card>
        </div>
    );
};

export default VariantManagement;