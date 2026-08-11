"use client";

import { useSwal } from "@/hooks/use-swal";
import { useWarehousesQuery } from "@/lib/api";
import { useCourierMutation } from "@/lib/api/hooks/courier";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import { Button, Form, Select } from "antd";

type AssignWarehouseProps = {
    selectedConfigId: string;
    storeId: string;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type AssignWarehouseFormValues = {
    warehouseId: string;
};

const AssignWarehouse = ({
    selectedConfigId,
    storeId,
    setOpen,
}: AssignWarehouseProps) => {
    const business = useAuthStore((s) => s.selectedBusiness);
    const businessId = business?.id ?? "";
    const swal = useSwal();

    const { data: warehouses, isLoading } = useWarehousesQuery(businessId);

    const { warehouseAssign } = useCourierMutation(businessId);

    const onFinish = async (values: AssignWarehouseFormValues) => {
        const payload = {
            configId: selectedConfigId,
            warehouseId: values.warehouseId,
        };

        try {
            await warehouseAssign.mutateAsync({
                storeId,
                payload,
            });
            swal.success("Warehouse assigned successfully.");
            setOpen(false);
        } catch (error) {
            swal.error(getApiErrorMessage(error))
        }
    };

    return (
        <Form<AssignWarehouseFormValues>
            layout="vertical"
            onFinish={onFinish}
        >
            <Form.Item
                label="Warehouse"
                name="warehouseId"
                rules={[
                    {
                        required: true,
                        message: "Please select a warehouse",
                    },
                ]}
            >
                <Select
                    placeholder="Select warehouse"
                    loading={isLoading}
                    showSearch
                    optionFilterProp="label"
                    options={(warehouses?.items ?? []).map((warehouse) => ({
                        label: warehouse.name,
                        value: warehouse.id,
                    }))}
                />
            </Form.Item>

            <div className="flex justify-end">
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={warehouseAssign.isPending}
                >
                    Assign Warehouse
                </Button>
            </div>
        </Form>
    );
};

export default AssignWarehouse;