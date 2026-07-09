"use client";

import {
  Inbox,
  Upload as UploadIcon
} from "lucide-react";


import { Button, Card, Col, Form, Input, Row, Upload, theme } from "antd";
import type { FormInstance } from "antd";
import type { UploadFile } from "antd/es/upload/interface";

const { Dragger } = Upload;

type UploadValues = {
  altText?: string;
  tags?: string;
};

type MediaUploadPanelProps = {
  form: FormInstance;
  fileList: UploadFile[];
  canUpload: boolean;
  disabled: boolean;
  loading: boolean;
  onFileListChange: (files: UploadFile[]) => void;
  onFinish: (values: UploadValues) => void;
};

export default function MediaUploadPanel({
  form,
  fileList,
  canUpload,
  disabled,
  loading,
  onFileListChange,
  onFinish,
}: MediaUploadPanelProps) {
  const { token } = theme.useToken();

  return (
    <Card
      style={{
        background: token.colorBgContainer,
        borderColor: token.colorBorderSecondary,
      }}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={[16, 8]}>
          <Col xs={24} lg={10}>
            <Form.Item
              label="Images"
              required
              tooltip="Choose one or more images for this business."
            >
              <Dragger
                accept="image/*"
                beforeUpload={() => false}
                disabled={!canUpload || disabled}
                fileList={fileList}
                multiple
                onChange={({ fileList: nextFiles }) =>
                  onFileListChange(nextFiles)
                }
                showUploadList={{ showRemoveIcon: true }}
                style={{
                  background: token.colorFillTertiary,
                  borderColor: token.colorBorder,
                }}
              >
                <p className="ant-upload-drag-icon">
                  <Inbox style={{ color: token.colorPrimary }} />
                </p>
                <p
                  className="ant-upload-text"
                  style={{ color: token.colorText }}
                >
                  Drop images here
                </p>
                <p
                  className="ant-upload-hint"
                  style={{ color: token.colorTextSecondary }}
                >
                  Upload single images or a small batch with shared metadata.
                </p>
              </Dragger>
            </Form.Item>
          </Col>

          <Col xs={24} lg={14}>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item label="Alt text" name="altText">
                  <Input placeholder="Hero banner, storefront logo..." />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item label="Tags" name="tags">
                  <Input placeholder="hero,banner,homepage" />
                </Form.Item>
              </Col>
            </Row>

            <Button
              disabled={!canUpload}
              htmlType="submit"
              icon={<UploadIcon />}
              loading={loading}
              type="primary"
            >
              Upload media
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}
