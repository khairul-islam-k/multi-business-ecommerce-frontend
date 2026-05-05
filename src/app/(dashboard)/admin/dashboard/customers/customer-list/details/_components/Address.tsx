import { Card, Col, Row, Tag } from "antd";
import {
  EnvironmentOutlined,
  FileMarkdownOutlined,
  PhoneOutlined,
} from "@ant-design/icons";

type Customer = {
  id: number;
  customer: string;
  contact: string;
  email: string;
  city: string;
  source: string;
  orders: number;
  spent: string;
  status: "Active" | "Inactive";
};

type Props = {
  userData: Customer;
};

const Address = ({ userData }: Props) => {
  return (
    <div>
      <Row gutter={20}>
        <Col xs={24} md={12}>
          <Card title="Contact Info" style={{ height: "100%" }}>
            <h4>
              <PhoneOutlined /> {userData.contact}
            </h4>
            <p>
              <FileMarkdownOutlined /> {userData.email}
            </p>
            <p>
              <EnvironmentOutlined /> {userData.city}
            </p>
            <p>Region: Federal · District: Islamabad · Source: Website</p>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Addresses (2)" style={{ height: "100%" }}>
            <Card style={{ marginBottom: "10px" }}>
              <h3 style={{ fontSize: "17px" }}>
                Home <Tag>Default</Tag>
              </h3>
              <p>House 12, Street 5, F-8, Islamabad Islamabad · 44000</p>
            </Card>

            <Card>
              <h3 style={{ fontSize: "17px" }}>Office</h3>
              <p>Office 301, Blue Area, Islamabad Islamabad · 44000</p>
            </Card>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Address;
