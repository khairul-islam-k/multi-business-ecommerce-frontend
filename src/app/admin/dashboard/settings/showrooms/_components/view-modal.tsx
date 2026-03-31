"use client";

import { Modal, Descriptions } from "antd";

export default function ViewModal({ open, onClose, showroom }: any) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Showroom Details"
    >
      {showroom && (
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="Name">{showroom.name}</Descriptions.Item>
          <Descriptions.Item label="Code">{showroom.code}</Descriptions.Item>
          <Descriptions.Item label="Phone">{showroom.phone}</Descriptions.Item>
          <Descriptions.Item label="City">{showroom.city}</Descriptions.Item>
          <Descriptions.Item label="District">
            {showroom.district}
          </Descriptions.Item>
          <Descriptions.Item label="Address">
            {showroom.address}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            {showroom.status}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
}
