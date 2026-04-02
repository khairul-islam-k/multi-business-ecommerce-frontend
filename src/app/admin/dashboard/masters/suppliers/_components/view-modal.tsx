"use client";

import { Modal, Descriptions } from "antd";

export default function ViewModal({ open, onClose, supplier }: any) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Supplier Details"
    >
      {supplier && (
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="Name">{supplier.name}</Descriptions.Item>
          <Descriptions.Item label="Code">{supplier.code}</Descriptions.Item>
          <Descriptions.Item label="Email">{supplier.email}</Descriptions.Item>
          <Descriptions.Item label="Phone">{supplier.phone}</Descriptions.Item>
          <Descriptions.Item label="Contact Person">
            {supplier.contact_person}
          </Descriptions.Item>
          <Descriptions.Item label="City">{supplier.city}</Descriptions.Item>
          <Descriptions.Item label="District">
            {supplier.district}
          </Descriptions.Item>
          <Descriptions.Item label="Country">
            {supplier.country}
          </Descriptions.Item>
          <Descriptions.Item label="Address">
            {supplier.address}
          </Descriptions.Item>
          <Descriptions.Item label="Notes">{supplier.notes}</Descriptions.Item>
          <Descriptions.Item label="Status">
            {supplier.status}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
}
