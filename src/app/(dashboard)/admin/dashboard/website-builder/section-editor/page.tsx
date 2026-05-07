"use client";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Grid, Select, Space } from "antd";
import { useState } from "react";
import ConfigCollapse from "./_components/section-collapse";

const SectionEditor = () => {
  const [filterProduct, setFilterProduct] = useState<string>("Main Store-Home");
  const screens = Grid.useBreakpoint();

  return (
    <div>
      <div
        style={{
          marginBottom: "24px",
        }}
      >
        <PageHeader
          title="Section Editor"
          breadcrumb={adminBreadcrumb}
        ></PageHeader>
      </div>
      <p>Manage and configure page sections</p>

      {/* filter */}
      <Space style={{ marginBottom: 16 }}>
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

        <Button icon={<PlusOutlined />} type="primary">
          Add Section
        </Button>
      </Space>

      {/* <SectionCollapse /> */}
      <ConfigCollapse />
    </div>
  );
};

export default SectionEditor;
