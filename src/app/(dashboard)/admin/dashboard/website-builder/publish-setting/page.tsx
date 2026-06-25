"use client";

import {
  Clock,
  Eye,
  Globe,
  ShieldCheck
} from "lucide-react";


import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import {
  Button,
  Card,
  Col,
  Flex,
  Grid,
  Row,
  Select,
  Switch,
  Tag,
  Typography,
} from "antd";
import { useState } from "react";

const { Text } = Typography;

const PublishSetting = () => {
  const [filterProduct, setFilterProduct] = useState<string>("Main Store-Home");
  const screens = Grid.useBreakpoint();

  const onChange = (checked: boolean) => {
    console.log("Maintenance mode:", checked);
  };

  return (
    <div>
      <div
        style={{
          marginBottom: "24px",
        }}
      >
        <PageHeader
          title="Publish Settings"
          breadcrumb={adminBreadcrumb}
        ></PageHeader>
      </div>
      <p>Control website visibility and publishing Website</p>

      {/* select */}
      <h3>Website</h3>
      <Select
        value={filterProduct}
        style={{
          width: screens.lg ? "200px" : "",
        }}
        onChange={setFilterProduct}
      >
        <option value="Main Store-Home">Main Store-Home</option>
        <option value="Main Store-About Us">Main Store-About Us</option>
        <option value="Main Store-contact">Main Store-contact</option>
        <option value="Main Store Product">Main Store Product</option>
        <option value="Fashion Hub-Home">Fashion Hub-Home</option>
        <option value="Tech Outlet-Home">Tech Outlet-Home</option>
      </Select>

      {/* publish dynamics */}
      <Card
        style={{
          maxWidth: 600,
          marginTop: "24px",
        }}
      >
        <Flex justify="space-between">
          <div>
            <h3
              style={{
                fontSize: "18px",
                margin: 0,
                fontWeight: "bold",
              }}
            >
              Publishing
            </h3>
            <p>
              Current status: <Tag>published</Tag>
            </p>
          </div>

          <Button type="primary">Unpublish</Button>
        </Flex>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <Clock />
          <p
            style={{
              margin: 0,
            }}
          >
            Last published: 3/20/2026, 4:00:00 PM
          </p>
        </div>
      </Card>

      {/* Visibility Settings */}
      <Card
        style={{
          maxWidth: 600,
          marginTop: "24px",
        }}
      >
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          Visibility Settings
        </h3>

        <Row align="middle" justify="space-between">
          <Col>
            <Flex
              style={{
                gap: "5px",
              }}
            >
              <Globe />
              <Text strong>Maintenance Mode</Text>
            </Flex>
            <p>Show a maintenance page to visitors</p>
          </Col>

          <Col>
            <Switch onChange={onChange} />
          </Col>
        </Row>

        {/* Password Protection */}
        <Row align="middle" justify="space-between">
          <Col>
            <Flex
              style={{
                gap: "5px",
              }}
            >
              <ShieldCheck />
              <Text strong>Password Protection</Text>
            </Flex>
            <p>Require a password to access the site</p>
          </Col>

          <Col>
            <Switch onChange={onChange} />
          </Col>
        </Row>

        {/* Search Engine Indexing */}
        <Row align="middle" justify="space-between">
          <Col>
            <Flex
              style={{
                gap: "5px",
              }}
            >
              <Eye />
              <Text strong>Search Engine Indexing</Text>
            </Flex>
            <p>Allow search engines to index this site</p>
          </Col>

          <Col>
            <Switch onChange={onChange} />
          </Col>
        </Row>
      </Card>

      <div
        style={{
          maxWidth: 600,
          textAlign: "right",
          marginTop: "24px",
        }}
      >
        <Button type="primary">Save Setting</Button>
      </div>
    </div>
  );
};

export default PublishSetting;
