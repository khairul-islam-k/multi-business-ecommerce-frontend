"use client";

import { Modal, Descriptions, Image } from "antd";

export default function ViewModal({ open, onClose, category }: any) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Category Details"
    >
      {category && (
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="Image">
            <Image src={category.image} width={60} />
          </Descriptions.Item>

          <Descriptions.Item label="Name">{category.name}</Descriptions.Item>

          <Descriptions.Item label="Slug">{category.slug}</Descriptions.Item>

          <Descriptions.Item label="Parent">
            {category.parent_id || "—"}
          </Descriptions.Item>

          <Descriptions.Item label="Status">
            {category.status}
          </Descriptions.Item>

          <Descriptions.Item label="Description">
            {category.description}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
}
