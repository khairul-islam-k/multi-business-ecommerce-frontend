"use client";

import Image from "next/image";
import { Modal, Descriptions } from "antd";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ViewModal({ open, onClose, brand }: any) {
  return (
    <Modal open={open} onCancel={onClose} footer={null} title="Brand Details">
      {brand && (
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="Logo">
            <Image src={brand.logo} width={60} height={60} alt="" />
          </Descriptions.Item>

          <Descriptions.Item label="Name">{brand.name}</Descriptions.Item>

          <Descriptions.Item label="Slug">{brand.slug}</Descriptions.Item>

          <Descriptions.Item label="Status">{brand.status}</Descriptions.Item>

          <Descriptions.Item label="Description">
            {brand.description}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
}
