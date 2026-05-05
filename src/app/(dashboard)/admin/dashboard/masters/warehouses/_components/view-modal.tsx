"use client";

import { Modal, Descriptions } from "antd";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ViewModal({ open, onClose, warehouse }: any) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Warehouse Details"
    >
      {warehouse && (
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="Name">{warehouse.name}</Descriptions.Item>
          <Descriptions.Item label="Code">{warehouse.code}</Descriptions.Item>
          <Descriptions.Item label="Phone">{warehouse.phone}</Descriptions.Item>
          <Descriptions.Item label="Type">{warehouse.type}</Descriptions.Item>
          <Descriptions.Item label="City">{warehouse.city}</Descriptions.Item>
          <Descriptions.Item label="District">
            {warehouse.district}
          </Descriptions.Item>
          <Descriptions.Item label="Address">
            {warehouse.address}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            {warehouse.status}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
}
