"use client";
import { PlusOutlined } from '@ant-design/icons';
import { Button, Select } from 'antd';
import { useRouter } from 'next/navigation';
import React from 'react';

const ProductUnits = () => {
    const router = useRouter();


    return (
        <div>
            <div className="flex flex-col gap-3 md:flex-row">
                <Select
                    placeholder="Filter by status"
                    allowClear
                    style={{ width: 180 }}
                    onChange={(v) => setStatusFilter(v)}
                    options={[
                        { label: "Active", value: "Active" },
                        { label: "Inactive", value: "Inactive" },
                    ]}
                />

                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() =>
                        router.push("/admin/dashboard/products-management/units/create")
                    }
                >
                    New Units
                </Button>
            </div>

            Units
        </div>
    );
};

export default ProductUnits;