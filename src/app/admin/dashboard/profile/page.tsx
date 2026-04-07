"use client";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { CameraOutlined, UserOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space,
  Tabs,
  theme,
  Upload,
} from "antd";
import { useState } from "react";

import ChangePassword from "./components/ChangePassword";

const { TextArea } = Input;

const BusinessProfile = () => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  console.log(imageUrl);

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setImageUrl(reader.result as string);
    reader.readAsDataURL(file);
    return false;
  };

  const onFinish = (values: any) => {
    console.log("Profile Data:", values);
  };

  const { token } = theme.useToken();
  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <PageHeader
          title="Business Profile"
          breadcrumb={adminBreadcrumb}
        ></PageHeader>
      </div>

      <Tabs
        items={[
          {
            key: "profile",
            label: "Profile",
            children: (
              <div
                style={{
                  background: token.colorBgBase,
                  padding: "20px",
                  borderRadius: "8px",
                }}
              >
                <Space
                  orientation="horizontal"
                  align="center"
                  style={{ marginBottom: 24 }}
                >
                  <div>
                    <Avatar size={50} src={imageUrl} icon={<UserOutlined />} />
                    <div style={{ display: "flex", justifyContent: "end" }}>
                      <Upload
                        beforeUpload={handleUpload}
                        showUploadList={false}
                        style={{
                          background: token.colorPrimary,
                          color: token.colorWhite,
                          height: "20px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          width: "20px",
                          borderRadius: "100%",
                          marginTop: "-10px",
                          cursor: "pointer",
                        }}
                      >
                        <div>
                          <CameraOutlined />
                        </div>
                      </Upload>
                    </div>
                  </div>

                  <div>
                    <h3 style={{ fontSize: "20px" }}>Upload Photo</h3>
                    <p>JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </Space>

                <Form layout="vertical" form={form} onFinish={onFinish}>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="First Name"
                        initialValue="khairul islam"
                        name="firstName"
                        rules={[{ required: true }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Last Name"
                        initialValue="Doe"
                        name="lastName"
                        rules={[{ required: true }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Email"
                        name="email"
                        initialValue="doe@gmail.com"
                        rules={[{ type: "email", required: true }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Phone"
                        initialValue="+1 555 123 4567"
                        name="phone"
                      >
                        <Input />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Gender"
                        initialValue="male"
                        name="gender"
                      >
                        <Select placeholder="Select gender">
                          <Select.Option value="male">Male</Select.Option>
                          <Select.Option value="female">Female</Select.Option>
                          <Select.Option value="other">Other</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item label="Date of Birth" name="dob">
                        <DatePicker style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>

                    <Col xs={24}>
                      <Form.Item label="Address" name="address">
                        <TextArea rows={3} placeholder="Address" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item label="City" name="city">
                        <Input />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item label="State" name="state">
                        <Input />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item label="Postal Code" name="postalCode">
                        <Input />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item label="Country" name="country">
                        <Input />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item label="Timezone" name="timezone">
                        <Select placeholder="Select timezone">
                          <Select.Option value="UTC">UTC</Select.Option>
                          <Select.Option value="EST">EST</Select.Option>
                          <Select.Option value="PST">PST</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Emergency Contact"
                        name="emergencyContact"
                      >
                        <Input />
                      </Form.Item>
                    </Col>

                    <Col xs={24}>
                      <Form.Item label="Notes" name="notes">
                        <TextArea rows={4} />
                      </Form.Item>
                    </Col>
                  </Row>

                  {/* Buttons */}
                  <Space>
                    <Button type="primary" htmlType="submit">
                      Save Changes
                    </Button>
                    <Button
                      htmlType="button"
                      onClick={() => form.resetFields()}
                    >
                      Cancel
                    </Button>
                  </Space>
                </Form>
              </div>
            ),
          },
          {
            key: "security",
            label: "Security",
            children: (
              <div className="w-full max-w-2xl mx-auto">
                <ChangePassword />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};

export default BusinessProfile;
