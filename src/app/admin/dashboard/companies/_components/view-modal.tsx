"use client";

import { Modal, Typography, Space } from "antd";

const { Text } = Typography;

interface Props {
  open: boolean;
  onClose: () => void;
  company: any;
}

export default function ViewModal({ open, onClose, company }: Props) {
  return (
    <Modal open={open} onCancel={onClose} footer={null} title="Company Details">
      {company && (
        <Space orientation="vertical">
          <Text strong>Name: {company.companyName}</Text>
          <Text type="secondary">Industry: {company.industry}</Text>
          <Text>Employees: {company.employees}</Text>
          <Text>Plan: {company.plan}</Text>
          <Text>Status: {company.status}</Text>
          <Text>Description: {company.description}</Text>
        </Space>
      )}
    </Modal>
  );
}
