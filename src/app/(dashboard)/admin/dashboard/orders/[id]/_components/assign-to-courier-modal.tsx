"use client";

import { Button, Card, Form, Input, Modal, Select, Skeleton, Tag } from "antd";
import { CheckCircle2, PackageCheck, Truck } from "lucide-react";
import { useMemo, useState } from "react";

import { useSwal } from "@/hooks/use-swal";
import {
  useAreasQuery,
  useCourierMutation,
  useCourierQuery,
} from "@/lib/api/hooks/courier";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import { AssignToCourierPayload } from "@/types/courier/courier";

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

  const {
    data: courier,
    isLoading: courierLoading,
    isFetching: courierFetching,
  } = useCourierQuery(businessId);

  const {
    data: areas,
    isLoading: areaLoading,
    isFetching: areaFetching,
  } = useAreasQuery(businessId, selectedCourierConfigId);

  const { courierAssign } = useCourierMutation(businessId);

  const courierItems = courier?.items ?? [];
  const areaItems = areas?.areas ?? [];

  const selectedCourier = useMemo(() => {
    return courierItems.find((item) => item.id === selectedCourierConfigId);
  }, [courierItems, selectedCourierConfigId]);

  const areaOptions = useMemo(() => {
    return areaItems.map((area) => ({
      label: `${area.name} - ${area.district_name} (${area.post_code})`,
      value: String(area.id),
      area,
    }));
  }, [areaItems]);

  const handleCourierSelect = (courierConfigId: string) => {
    setSelectedCourierConfigId(courierConfigId);

    form.setFieldsValue({
      deliveryAreaId: undefined,
    });
  };

  const handleFinish = async (values: {
    deliveryAreaId: string;
    specialInstruction?: string;
  }) => {
    const selectedArea = areaItems.find(
      (area) => String(area.id) === values.deliveryAreaId,
    );

    if (!selectedArea || !selectedCourierConfigId) return;
    setLoading(true);

    const payload: AssignToCourierPayload = {
      deliveryAreaId: String(selectedArea.id),
      deliveryAreaName: selectedArea.name,
      deliveryPostCode: String(selectedArea.post_code),
      deliveryDivisionName:
        selectedArea.division_name || selectedArea.district_name,
      specialInstruction: values.specialInstruction?.trim() || undefined,
      courierConfigId: selectedCourierConfigId,
    };

    try {
      const res = await courierAssign.mutateAsync({
        orderId,
        payload,
      });

      swal.success("Courier Assigned successfully");
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
          label="Delivery Area"
          name="deliveryAreaId"
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
            options={areaOptions}
            optionFilterProp="label"
          />
        </Form.Item>

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
