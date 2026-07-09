"use client";

import {
  useAreasQuery,
  useCourierPickUp,
  useCourierQuery,
} from "@/lib/api/hooks/courier";
import { useAuthStore } from "@/stores/auth.store";
import { WarehousePayload, WarehouseStatus } from "@/types/product/warehouse";
import { Button, Card, Form, Input, Select, Space } from "antd";
import { useEffect, useMemo, useState } from "react";

const { TextArea } = Input;

type CourierConfigItem = {
  id: string;
  courier?: {
    id?: string;
    name?: string;
    code?: string;
  };
};

type RedxArea = {
  id: number;
  name: string;
  post_code: number;
  district_name: string;
  division_name: string;
  zone_id: number;
};

type PickupStore = {
  id: number;
  name: string;
  address: string;
  area_name: string;
  area_id: number;
  phone: string;
};

export type WarehouseFormValues = {
  name: string;
  phone?: string;
  address?: string;

  redxAreaId?: string;
  redxAreaName?: string;
  redxPostCode?: string;
  redxPickupStoreId?: string;

  status?: WarehouseStatus;
};

type WarehouseFormProps = {
  mode: "create" | "update";
  initialValues?: Partial<WarehouseFormValues>;
  isSubmitting?: boolean;
  onSubmit: (values: WarehousePayload) => void | Promise<void>;
  onCancel?: () => void;
};

const WarehouseForm = ({
  mode,
  initialValues,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: WarehouseFormProps) => {
  const [form] = Form.useForm<WarehouseFormValues>();
  const [selectedConfigId, setSelectedConfigId] = useState<string>("");

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const {
    data: courier,
    isLoading: courierLoading,
    isFetching: courierFetching,
  } = useCourierQuery(businessId);

  const courierItems = useMemo<CourierConfigItem[]>(() => {
    return courier?.items ?? [];
  }, [courier?.items]);

  useEffect(() => {
    if (courierItems.length > 0 && !selectedConfigId) {
      setSelectedConfigId(courierItems[0].id);
    }
  }, [courierItems, selectedConfigId]);

  const { data: areas, isLoading: areasLoading } = useAreasQuery(
    businessId,
    selectedConfigId,
  );

  const { data: pickUpStores, isLoading: pickupStoreLoading } =
    useCourierPickUp(businessId, selectedConfigId);

  const courierOptions = useMemo(() => {
    return courierItems.map((item) => ({
      label: item.courier?.name ?? item.id,
      value: item.id,
    }));
  }, [courierItems]);

  const areaOptions = useMemo(() => {
    return (areas?.areas ?? []).map((area: RedxArea) => ({
      label: `${area.name} - ${area.district_name} (${area.post_code})`,
      value: String(area.id),

      redxAreaId: String(area.id),
      redxAreaName: area.name,
      redxPostCode: String(area.post_code),
    }));
  }, [areas?.areas]);

  const pickupStoreOptions = useMemo(() => {
    return (pickUpStores?.pickup_stores ?? []).map((store: PickupStore) => ({
      label: `${store.name} - ${store.area_name} (${store.phone})`,
      value: String(store.id),
    }));
  }, [pickUpStores?.pickup_stores]);

  useEffect(() => {
    if (!initialValues) return;

    form.setFieldsValue({
      name: initialValues.name ?? "",
      phone: initialValues.phone ?? undefined,
      address: initialValues.address ?? undefined,

      redxAreaId: initialValues.redxAreaId
        ? String(initialValues.redxAreaId)
        : undefined,

      redxAreaName: initialValues.redxAreaName ?? undefined,

      redxPostCode: initialValues.redxPostCode
        ? String(initialValues.redxPostCode)
        : undefined,

      redxPickupStoreId: initialValues.redxPickupStoreId
        ? String(initialValues.redxPickupStoreId)
        : undefined,

      status: initialValues.status ?? undefined,
    });
  }, [form, initialValues]);

  const handleCourierChange = (configId?: string) => {
    setSelectedConfigId(configId ?? "");

    form.setFieldsValue({
      redxAreaId: undefined,
      redxAreaName: undefined,
      redxPostCode: undefined,
      redxPickupStoreId: undefined,
    });
  };

  const handleAreaChange = (
    _value: string | undefined,
    option:
      | {
          redxAreaId: string;
          redxAreaName: string;
          redxPostCode: string;
        }
      | {
          redxAreaId: string;
          redxAreaName: string;
          redxPostCode: string;
        }[]
      | undefined,
  ) => {
    if (!option || Array.isArray(option)) {
      form.setFieldsValue({
        redxAreaId: undefined,
        redxAreaName: undefined,
        redxPostCode: undefined,
      });

      return;
    }

    form.setFieldsValue({
      redxAreaId: option.redxAreaId,
      redxAreaName: option.redxAreaName,
      redxPostCode: option.redxPostCode,
    });
  };

  const handleFinish = (values: WarehouseFormValues) => {
    const payload: WarehousePayload = {
      name: values.name.trim(),

      ...(values.phone?.trim()
        ? {
            phone: values.phone.trim(),
          }
        : {}),

      ...(values.address?.trim()
        ? {
            address: values.address.trim(),
          }
        : {}),

      ...(values.redxAreaId
        ? {
            redxAreaId: String(values.redxAreaId),
            redxAreaName: values.redxAreaName,
            redxPostCode: values.redxPostCode,
          }
        : {}),

      ...(values.redxPickupStoreId
        ? {
            redxPickupStoreId: String(values.redxPickupStoreId),
          }
        : {}),

      ...(values.status
        ? {
            status: values.status,
          }
        : {}),
    };

    console.log("warehouse payload", payload);

    onSubmit(payload);
  };

  return (
    <Card title={mode === "create" ? "Create Warehouse" : "Update Warehouse"}>
      <Form<WarehouseFormValues>
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        requiredMark={true}
        initialValues={{
          name: "",
          phone: undefined,
          address: undefined,

          redxAreaId: undefined,
          redxAreaName: undefined,
          redxPostCode: undefined,
          redxPickupStoreId: undefined,

          status: undefined,
        }}
      >
        <Form.Item
          label="Warehouse Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Warehouse name is required",
            },
            {
              min: 2,
              message: "Warehouse name must be at least 2 characters",
            },
          ]}
        >
          <Input placeholder="Main warehouse" />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          validateTrigger="onChange"
          rules={[
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();

                const phone = String(value).trim();
                const bdPhoneRegex = /^(\+?8801|01)[3-9]\d{8}$/;

                if (!bdPhoneRegex.test(phone)) {
                  return Promise.reject(
                    new Error("Enter a valid Bangladesh phone number"),
                  );
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <Input placeholder="+8801700000000" />
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={[
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();

                if (String(value).trim().length < 5) {
                  return Promise.reject(
                    new Error("Address must be at least 5 characters"),
                  );
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <TextArea rows={3} placeholder="House 10, Road 2, Dhaka" />
        </Form.Item>

        <Form.Item label="Courier">
          <Select
            showSearch
            allowClear
            placeholder="Select courier"
            loading={courierLoading || courierFetching}
            value={selectedConfigId || undefined}
            options={courierOptions}
            optionFilterProp="label"
            onChange={handleCourierChange}
            filterOption={(input, option) =>
              String(option?.label ?? "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          />
        </Form.Item>

        <Form.Item label="REDX Area" name="redxAreaId">
          <Select
            showSearch
            allowClear
            placeholder="Search and select REDX area"
            loading={areasLoading}
            options={areaOptions}
            optionFilterProp="label"
            onChange={handleAreaChange}
            filterOption={(input, option) =>
              String(option?.label ?? "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          />
        </Form.Item>

        <Form.Item name="redxAreaName" hidden>
          <Input />
        </Form.Item>

        <Form.Item name="redxPostCode" hidden>
          <Input />
        </Form.Item>

        <Form.Item label="REDX Pickup Store" name="redxPickupStoreId">
          <Select
            showSearch
            allowClear
            placeholder="Search and select pickup store"
            loading={pickupStoreLoading}
            options={pickupStoreOptions}
            optionFilterProp="label"
            filterOption={(input, option) =>
              String(option?.label ?? "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          />
        </Form.Item>

        <Form.Item label="Status" name="status">
          <Select
            allowClear
            placeholder="Select status"
            options={[
              {
                label: "Active",
                value: "ACTIVE",
              },
              {
                label: "Inactive",
                value: "INACTIVE",
              },
            ]}
          />
        </Form.Item>

        <Space>
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            {mode === "create" ? "Create Warehouse" : "Update Warehouse"}
          </Button>

          {onCancel && (
            <Button onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          )}
        </Space>
      </Form>
    </Card>
  );
};

export default WarehouseForm;