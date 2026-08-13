"use client";

import { Button, Card, Form, Input, Modal, Select, Skeleton, Tag } from "antd";
import { CheckCircle2, PackageCheck, Truck } from "lucide-react";
import { useMemo, useState } from "react";

import { useSwal } from "@/hooks/use-swal";
import {
  useCitiesQuery,
  useCourierMutation,
  useCourierQuery,
  useCourierZone,
} from "@/lib/api/hooks/courier";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import { AssignToCourierPayload, PathaoZone } from "@/types/courier/courier";
import { useWatch } from "antd/es/form/Form";

type AssignToCourierModalProps = {
  open: boolean;
  orderId: string;
  onClose: () => void;
};

const AssignToCourierModal = ({
  open,
  orderId,
  onClose,
}: AssignToCourierModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>();
  const swal = useSwal();

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const [selectedCourierConfigId, setSelectedCourierConfigId] =
    useState<string>("");

    const cityId = Form.useWatch("deliveryCityId", form);

  const {
    data: courier,
    isLoading: courierLoading,
    isFetching: courierFetching,
  } = useCourierQuery(businessId);

  const {
    data: cities,
    isLoading: areaLoading,
    isFetching: areaFetching,
  } = useCitiesQuery(businessId, selectedCourierConfigId);

  const {
    data: zones,
  isLoading: zoneLoading,
  isFetching: zoneFetching,
} = useCourierZone(businessId, selectedCourierConfigId, cityId);

  const { courierAssign } = useCourierMutation(businessId);

  const courierItems = courier?.items ?? [];
  const cityItems = cities?.data.areas ?? [];
  const zoneItems = (zones?.data?.data ?? []) as PathaoZone[];

  const selectedCourier = useMemo(() => {
    return courierItems.find((item) => item.id === selectedCourierConfigId);
  }, [courierItems, selectedCourierConfigId]);

  const isPathao = selectedCourier?.courier.code === "PATHAO";

  const citiesOptions = useMemo(() => {
    return cityItems.map((area) => ({
      label: area.city_name,
      value: String(area.city_id),
      area,
    }));
  }, [cityItems]);

  const zonesOptions = useMemo(() => {
    return zoneItems.map((area) => ({
      label: area.zone_name,
      value: String(area.zone_id),
      area,
    }));
  }, [zoneItems]);

  const handleCourierSelect = (courierConfigId: string) => {
    setSelectedCourierConfigId(courierConfigId);

    form.setFieldsValue({
      deliveryCityId: undefined,
    });
  };

  const handleFinish = async (values: {
    deliveryCityId: string;
    specialInstruction?: string;
    deliveryZoneId?: string;
  }) => {
    const selectedCity = cityItems.find(
      (area) => String(area.city_id) === values.deliveryCityId,
    );

    const zoneId = selectedCity?.zone_id ?? values.deliveryZoneId;

    if (!selectedCity || !selectedCourierConfigId) return;
    setLoading(true);

    const payload: AssignToCourierPayload = {
      deliveryCityId: String(selectedCity.city_id),
      deliveryAreaName: selectedCity.city_name,
      ...(selectedCity.post_code ? {
        deliveryPostCode: String(selectedCity.post_code)
      }: {}),
        deliveryDivisionName: selectedCity.division_name ?? "",
      ...(zoneId ? {
        deliveryZoneId: String(zoneId),
      }: {}),
      specialInstruction: values.specialInstruction?.trim() || undefined,
      courierConfigId: selectedCourierConfigId,
    };

    try {
      await courierAssign.mutateAsync({
        orderId,
        payload,
      });

      swal.success("Courier Assigned successfully");
      handleClose();
    } catch (error) {
      swal.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }

    form.resetFields();
    setSelectedCourierConfigId("");
  };

  const handleClose = () => {
    form.resetFields();
    setSelectedCourierConfigId("");
    onClose();
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <Truck size={18} />
          <span>Assign to Courier</span>
        </div>
      }
      open={open}
      onCancel={handleClose}
      footer={null}
      destroyOnHidden
      centered
      width={960}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <div className="mb-4">
          <p className="mb-2 text-sm font-medium text-gray-700">
            Select Courier
          </p>

          {courierLoading || courierFetching ? (
            <Skeleton active paragraph={{ rows: 2 }} />
          ) : courierItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {courierItems.map((item) => {
                const isSelected = selectedCourierConfigId === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleCourierSelect(item.id)}
                    className={`rounded-xl border p-4 text-left transition-all ${
                      isSelected
                        ? "border-blue-500 bg-blue-50 shadow-sm"
                        : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                            isSelected
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <Truck size={20} />
                        </div>

                        <div className="min-w-0">
                          <h4 className="m-0 truncate text-base font-semibold">
                            {item.courier?.name ?? "Unknown Courier"}
                          </h4>

                          <p className="m-0 truncate text-xs text-gray-500">
                            {item.courier?.code ?? "-"} | {item.mode}
                          </p>
                        </div>
                      </div>

                      {isSelected && (
                        <CheckCircle2
                          size={20}
                          className="shrink-0 text-blue-600"
                        />
                      )}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <Tag color={item.status === "ACTIVE" ? "green" : "red"}>
                        {item.status}
                      </Tag>

                      <Tag color={item.webhookConfigured ? "green" : "orange"}>
                        {item.webhookConfigured
                          ? "Webhook Ready"
                          : "No Webhook"}
                      </Tag>
                    </div>

                    <p className="m-0 mt-2 truncate text-[11px] text-gray-400">
                      Config: {item.id}
                    </p>
                  </button>
                );
              })}
            </div>
          ) : (
            <Card size="small" className="bg-gray-50 text-center">
              <p className="m-0 text-sm text-gray-500">
                No courier configuration found.
              </p>
            </Card>
          )}
        </div>

        <Form.Item
          label="Delivery City"
          name="deliveryCityId"
          rules={[{ required: true, message: "Please select delivery area" }]}
        >
          <Select
            placeholder={
              selectedCourierConfigId
                ? "Select delivery area"
                : "Select courier first"
            }
            disabled={!selectedCourierConfigId}
            loading={areaLoading || areaFetching}
            showSearch
            allowClear
            options={citiesOptions}
            optionFilterProp="label"
          />
        </Form.Item>

        {
          isPathao && <Form.Item
          label="Delivery zones"
          name="deliveryZoneId"
          rules={[{ required: true, message: "Please select delivery area" }]}
        >
          <Select
            placeholder={
              selectedCourierConfigId
                ? "Select delivery area"
                : "Select courier first"
            }
            disabled={!selectedCourierConfigId && !cityId}
            loading={zoneLoading || zoneFetching}
            showSearch
            allowClear
            options={zonesOptions}
            optionFilterProp="label"
          />
        </Form.Item>
        }

        <Form.Item label="Special Instruction" name="specialInstruction">
          <Input.TextArea rows={4} placeholder="Please call before delivery" />
        </Form.Item>

        {selectedCourier && (
          <Card size="small" className="mb-4 bg-gray-50">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="m-0 text-sm text-gray-500">Selected Courier</p>
                <p className="m-0 font-semibold">
                  {selectedCourier.courier?.name}
                </p>
              </div>

              <div className="md:text-right">
                <p className="m-0 text-sm text-gray-500">Courier Config ID</p>
                <p className="m-0 max-w-[300px] truncate text-xs font-medium">
                  {selectedCourier.id}
                </p>
              </div>
            </div>
          </Card>
        )}

        <div className="flex justify-end gap-3">
          <Button onClick={handleClose}>Cancel</Button>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            icon={<PackageCheck size={16} />}
            disabled={!selectedCourierConfigId}
          >
            Assign Courier
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AssignToCourierModal;
