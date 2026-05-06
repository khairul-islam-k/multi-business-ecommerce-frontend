"use client";

import { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  ColorPicker,
  Input,
  Row,
  Space,
  theme,
  Upload,
} from "antd";

import Preview from "./components/Preview";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const BusinessBranding = () => {
  const { token } = theme.useToken();

  // upload file
  const [fileName, setFileName] = useState<string>("");

  // color state
  const [primaryColor, setPrimaryColor] = useState<string>("#1677ff");
  const [secondaryColor, setSecondaryColor] = useState<string>("#f4f4f5");
  const [accentColor, setAccentColor] = useState<string>("#8b5cf6");

  const beforeUpload = (file: File) => {
    if (file.size / 1024 / 1024 > 2) {
      return Upload.LIST_IGNORE;
    }
    setFileName(file.name);
    return false; // prevent automatic upload
  };
  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <PageHeader title="Branding" breadcrumb={adminBreadcrumb}></PageHeader>
      </div>

      <Row gutter={[16, 16]}>
        {/* different Logo */}
        <Col xs={24} md={12}>
          <Card style={{ height: "100%" }}>
            <h4 style={{ fontWeight: 500, fontSize: "20px" }}>
              Logos & Assets
            </h4>
            <p>Upload your brand assets for use across the platform.</p>

            <section style={{ marginBottom: "30px", marginTop: "30px" }}>
              <h5>Company Logo</h5>
              <p>Used in sidebar and emails. Recommended: 200×60px PNG.</p>
              <Row gutter={8} align="middle">
                {/* File Name Field */}
                <Col>
                  <Input
                    style={{
                      height: "60px",
                      width: "100px",
                      background: token.colorBgContainerDisabled,
                    }}
                    placeholder="No file"
                    value={fileName}
                    readOnly
                  />
                </Col>

                {/* Upload Button */}
                <Col>
                  <Upload
                    beforeUpload={beforeUpload}
                    showUploadList={false}
                    accept=".pdf,.jpg,.png"
                  >
                    <Button icon={<UploadOutlined />}>Upload</Button>
                  </Upload>
                </Col>
              </Row>
            </section>

            <section style={{ marginBottom: "30px" }}>
              <h5>Favicon</h5>
              <p>Browser tab icon. Recommended: 32×32px ICO/PNG.</p>
              <Row gutter={8} align="middle">
                {/* File Name Field */}
                <Col>
                  <Input
                    style={{
                      height: "60px",
                      width: "100px",
                      background: token.colorBgContainerDisabled,
                    }}
                    placeholder="No file"
                    value={fileName}
                    readOnly
                  />
                </Col>

                {/* Upload Button */}
                <Col>
                  <Upload
                    beforeUpload={beforeUpload}
                    showUploadList={false}
                    accept=".pdf,.jpg,.png"
                  >
                    <Button icon={<UploadOutlined />}>Upload</Button>
                  </Upload>
                </Col>
              </Row>
            </section>

            <section style={{ marginBottom: "30px" }}>
              <h5>Invoice Header Logo</h5>
              <p>
                Appears on invoices and receipts. Recommended: 300×100px PNG.
              </p>
              <Row gutter={8} align="middle">
                {/* File Name Field */}
                <Col>
                  <Input
                    style={{
                      height: "60px",
                      width: "100px",
                      background: token.colorBgContainerDisabled,
                    }}
                    placeholder="No file"
                    value={fileName}
                    readOnly
                  />
                </Col>

                {/* Upload Button */}
                <Col>
                  <Upload
                    beforeUpload={beforeUpload}
                    showUploadList={false}
                    accept=".pdf,.jpg,.png"
                  >
                    <Button icon={<UploadOutlined />}>Upload</Button>
                  </Upload>
                </Col>
              </Row>
            </section>
          </Card>
        </Col>

        {/* color here */}
        <Col xs={24} md={12}>
          <Card style={{ height: "100%" }}>
            <h4 style={{ fontWeight: 500, fontSize: "20px" }}>Brand Colors</h4>
            <p>Set your brand palette for emails, receipts, and invoices.</p>

            {/* Primary Color */}
            <section style={{ marginBottom: "30px" }}>
              <h5>Primary Color</h5>

              {/* color pick */}
              <Space size={12}>
                {/* Color Picker Square */}
                <ColorPicker
                  value={primaryColor}
                  onChange={(value) => setPrimaryColor(value.toHexString())}
                  showText={false}
                  styles={{
                    popupOverlayInner: { width: 220 },
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 6,
                      border: "1px solid #d9d9d9",
                      backgroundColor: primaryColor,
                      cursor: "pointer",
                    }}
                  />
                </ColorPicker>

                {/* Color Code Input Square */}
                <Input
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  style={{
                    width: 120,
                    height: 40,
                    borderRadius: 6,
                    textTransform: "uppercase",
                  }}
                  placeholder="#FFFFFF"
                />
              </Space>
            </section>

            {/* Secondary Color */}
            <section style={{ marginBottom: "30px" }}>
              <h5>Secondary Color</h5>

              {/* color pick */}
              <Space size={12}>
                {/* Color Picker Square */}
                <ColorPicker
                  value={secondaryColor}
                  onChange={(value) => setSecondaryColor(value.toHexString())}
                  showText={false}
                  styles={{
                    popupOverlayInner: { width: 220 },
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 6,
                      border: "1px solid #d9d9d9",
                      backgroundColor: secondaryColor,
                      cursor: "pointer",
                    }}
                  />
                </ColorPicker>

                {/* Color Code Input Square */}
                <Input
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  style={{
                    width: 120,
                    height: 40,
                    borderRadius: 6,
                    textTransform: "uppercase",
                  }}
                  placeholder="#FFFFFF"
                />
              </Space>
            </section>

            {/* Accent Color */}
            <section style={{ marginBottom: "30px" }}>
              <h5>Accent Color</h5>

              {/* color pick */}
              <Space size={12}>
                {/* Color Picker Square */}
                <ColorPicker
                  value={accentColor}
                  onChange={(value) => setAccentColor(value.toHexString())}
                  showText={false}
                  styles={{
                    popupOverlayInner: { width: 220 },
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 6,
                      border: "1px solid #d9d9d9",
                      backgroundColor: accentColor,
                      cursor: "pointer",
                    }}
                  />
                </ColorPicker>

                {/* Color Code Input Square */}
                <Input
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  style={{
                    width: 120,
                    height: 40,
                    borderRadius: 6,
                    textTransform: "uppercase",
                  }}
                  placeholder="#FFFFFF"
                />
              </Space>
            </section>

            {/* preview */}
            <Preview
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
              accentColor={accentColor}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BusinessBranding;
