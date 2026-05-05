"use client";

import { useParams } from "next/navigation";
import { Form, Input, InputNumber, Button, Card } from "antd";

interface CourierChargeFormValues {
  courier: string;
  zone: string;
  insideCity: number;
  subCity: number;
  outsideCity: number;
  codCharge: number;
}

const defaultValues: CourierChargeFormValues = {
  courier: "TCS Express",
  zone: "Karachi Metro",
  insideCity: 150,
  subCity: 200,
  outsideCity: 300,
  codCharge: 30,
};

const UpdateCharge = () => {
  const { id } = useParams();
  const onFinish = (values: CourierChargeFormValues) => {
    console.log("Updated Courier Charges:", values);
  };

  return (
    <div>
      <Card title="Edit Courier Shipping Charges" style={{ maxWidth: 600 }}>
        <Form
          layout="vertical"
          initialValues={defaultValues}
          onFinish={onFinish}
        >
          <Form.Item label="Courier" name="courier">
            <Input disabled />
          </Form.Item>

          <Form.Item label="Zone" name="zone">
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="Inside City Charge (Rs)"
            name="insideCity"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Sub City Charge (Rs)"
            name="subCity"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Outside City Charge (Rs)"
            name="outsideCity"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="COD Charge (Rs)"
            name="codCharge"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update Charges
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UpdateCharge;
