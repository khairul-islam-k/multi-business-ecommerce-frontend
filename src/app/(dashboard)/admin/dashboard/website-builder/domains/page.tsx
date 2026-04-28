"use client";

import DomainTable from "./_components/DomainTable";
import { Button, Card, Col, Flex, Form, Input, Row, Select, theme } from "antd";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useSwal } from "@/hooks/use-swal";

const { Option } = Select;

const DomainManager = () => {
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const swal = useSwal();

  const detailData = [
    {
      id: 1,
      Icon: CheckCircleOutlined,
      count: 3,
      title: "Verified",
    },
    {
      id: 2,
      Icon: ClockCircleOutlined,
      count: 1,
      title: "Pending",
    },
    {
      id: 3,
      Icon: CloseCircleOutlined,
      count: 1,
      title: "Failed",
    },
  ];

  const onFinish = (values: any) => {
    console.log("Form values:", values);
    swal.success(`Page "${values.Title}" added successfully!`);
    form.resetFields();
  };

  return (
    <div>
      <div
        style={{
          marginBottom: "24px",
        }}
      >
        <PageHeader
          title="Domain Manager"
          breadcrumb={adminBreadcrumb}
        ></PageHeader>
      </div>

      {/* card over view */}
      {/* card */}
      <Row style={{ marginBottom: "24px" }} gutter={[15, 15]}>
        {detailData.map((singleData) => {
          const IconComponent = singleData.Icon;
          return (
            <Col xs={24} md={8} key={singleData.id}>
              <Card>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <div
                    style={{
                      background: token.colorBgContainerDisabled,
                      height: "50px",
                      width: "50px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "10px",
                    }}
                  >
                    <IconComponent style={{ fontSize: "30px" }} />
                  </div>
                  <div>
                    <h3
                      style={{
                        fontSize: "20px",
                        marginBottom: 0!,
                      }}
                    >
                      {singleData.count}
                    </h3>
                    <p>{singleData.title}</p>
                  </div>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>

      <DomainTable />

      {/* From */}
      <Card style={{ marginTop: "24px" }} title="Add Domain">
        <Form form={form} onFinish={onFinish} style={{ width: "100%" }}>
          <h3>Domain name</h3>
          <Row gutter={[15, 15]} align="middle">
            <Col xs={24} md={14}>
              <Form.Item
                name="Title"
                rules={[{ required: true, message: "Please enter page title" }]}
              >
                <Input placeholder="Page Title" />
              </Form.Item>
            </Col>

            <Col xs={24} md={10}>
              <div
                style={{
                  width: "100%",
                }}
              >
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: "100%" }}
                  >
                    Add Page
                  </Button>
                </Form.Item>
              </div>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default DomainManager;
