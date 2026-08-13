"use client";

import { Button, Card, Form, Input, Select } from "antd";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

import { useAuthStore } from "@/stores/auth.store";
import { PathaoZone, PickupStorePayload } from "@/types/courier/courier";
import { useCitiesQuery, useCourierAreas, useCourierQuery, useCourierZone } from "@/lib/api/hooks/courier";

type PickupStoreFormProps = {
  mode: "create" | "update";
  configId: string;
  initialValues?: Partial<PickupStorePayload>;
  loading?: boolean;
  onSubmit: (values: PickupStorePayload) => void | Promise<void>;
};

const defaultValues: PickupStorePayload = {
  name: "",
  phone: "",
  address: "",
  cityId: "",
};

const PickupStoreForm = ({
  configId,
  mode,
  initialValues,
  loading,
  onSubmit,
}: PickupStoreFormProps) => {
  const [form] = Form.useForm<PickupStorePayload>();
  const router = useRouter();
  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const {data: couriers} = useCourierQuery(businessId);
  const courier = couriers?.items.find(data => data.id === configId);

  const isPathao = courier?.courier.code === "PATHAO";

  const cityId = Form.useWatch("cityId", form);
  const zoneId = Form.useWatch("zoneId", form);

  const { data: cities } = useCitiesQuery(businessId, configId);

  const {data: zones} = useCourierZone(businessId, configId, cityId);
  const {data: areas} = useCourierAreas(businessId, configId, zoneId ?? '');

  const citiesOptions = useMemo(() => {
    return (cities?.data.areas ?? []).map((area) => ({
      label: `${area.city_name}`,
      value: String(area.city_id),
    }));
  }, [cities]);

  const allZones = (zones?.data?.data ?? []) as PathaoZone[];

  const zonesOptions = useMemo(() => {
    return allZones.map((area) => ({
      label: area.zone_name,
      value: String(area.zone_id),
    }));
  }, [allZones]);

  const areasOptions = useMemo(() => {
    return areas?.data?.data?.map((area) => ({
      label: area.area_name,
      value: String(area.area_id),
    }));
  }, [areas]);

  useEffect(() => {
    form.setFieldsValue({
      ...defaultValues,
      ...initialValues,
    });
  }, [form, initialValues]);

  const handleFinish = async (values: PickupStorePayload) => {
    const payload: PickupStorePayload = {
      name: values.name.trim(),
      phone: values.phone.trim(),
      address: values.address.trim(),
      cityId: String(values.cityId).trim(),
      ...(values.zoneId ? {
        zoneId: values.zoneId
      }: {}),
      ...(values.areaId ? {
        areaId: values.areaId
      }: {}),
    };

    await onSubmit(payload);
  };

  return (
    <Card className="rounded-2xl shadow-sm">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          ...defaultValues,
          ...initialValues,
        }}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Form.Item
            label="Store Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Store name is required",
              },
            ]}
          >
            <Input placeholder="Enter store name" />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            validateTrigger="onChange"
            rules={[
              {
                required: true,
                message: "Phone number is required",
              },
              {
                validator: (_, value) => {
                  if (!value) {
                    return Promise.resolve();
                  }

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
            label="Cities"
            name="cityId"
            rules={[
              {
                required: true,
                message: "Area is required",
              },
            ]}
          >
            <Select
              showSearch
              allowClear
              placeholder="Search and select area"
              options={citiesOptions}
              optionFilterProp="label"
              filterOption={(input, option) =>
                String(option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>

          {
            isPathao && <Form.Item
            label="zones"
            name="zoneId"
            rules={[
              {
                required: true,
                message: "Area is required",
              },
            ]}
          >
            <Select
              showSearch
              allowClear
              placeholder="Search and select area"
              options={zonesOptions}
              optionFilterProp="label"
              filterOption={(input, option) =>
                String(option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>
          }

          {
            isPathao && <Form.Item
            label="areas"
            name="areaId"
            rules={[
              {
                required: true,
                message: "Area is required",
              },
            ]}
          >
            <Select
              showSearch
              allowClear
              placeholder="Search and select area"
              options={areasOptions}
              optionFilterProp="label"
              filterOption={(input, option) =>
                String(option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>
          }

          <Form.Item
            label="Address"
            name="address"
            className="md:col-span-2"
            rules={[
              {
                required: true,
                message: "Address is required",
              },
            ]}
          >
            <Input.TextArea rows={4} placeholder="Enter pickup store address" />
          </Form.Item>
        </div>

        <div className="mt-5 flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
          <Button icon={<ArrowLeft size={16} />} onClick={() => router.back()}>
            Cancel
          </Button>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            icon={<Save size={16} />}
          >
            {mode === "create" ? "Create Pickup Store" : "Update Pickup Store"}
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default PickupStoreForm;
