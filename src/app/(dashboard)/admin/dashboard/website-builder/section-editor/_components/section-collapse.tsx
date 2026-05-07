"use client";

import { Collapse, Input, Button, Space } from "antd";
import { SettingOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState } from "react";

const { TextArea } = Input;

export default function ConfigCollapse() {
  const [config, setConfig] = useState(
    `{
  "heading": "Welcome to Main Store",
  "subheading": "Shop the best deals",
  "bg_color": "#f0f0f0"
   }`,
  );

  const [productFeature, setProductFeature] = useState(
    `{
"columns": 4,
"max_items": 8
}`,
  );

  const [testimonials, setTestimonials] = useState(
    `{
  "layout": "carousel",
  "show_stars": true
}`,
  );

  const [newsletter, setNewsletter] = useState(
    `{
  "title": "Stay Updated",
  "button_text": "Subscribe"
}`,
  );

  const handleSave = () => {
    try {
      const parsed = JSON.parse(config);
      console.log("Saved Config:", parsed);
    } catch {
      alert("Invalid JSON format");
    }
  };

  // items_1
  const item_1 = [
    {
      key: "1",
      label: (
        <Space
          style={{
            background: "white",
          }}
        >
          <SettingOutlined />
          <strong>hero</strong>
          <span style={{ color: "#999" }}>hero-banner</span>
          <span style={{ color: "#999" }}>Order: 1</span>
        </Space>
      ),
      extra: <DeleteOutlined style={{ color: "red" }} />,
      children: (
        <>
          <div style={{ marginBottom: 8, fontWeight: 500 }}>Config JSON</div>

          <TextArea
            value={config}
            onChange={(e) => setConfig(e.target.value)}
            rows={8}
            style={{
              fontFamily: "monospace",
              borderRadius: 8,
            }}
          />

          <div
            style={{ textAlign: "right", marginTop: 12, marginBottom: "10px" }}
          >
            <Button type="primary" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </>
      ),
    },
  ];

  const item_2 = [
    {
      key: "2",
      label: (
        <Space
          style={{
            background: "white",
          }}
        >
          <SettingOutlined />
          <strong>featured_products</strong>
          <span style={{ color: "#999" }}>featured-grid</span>
          <span style={{ color: "#999" }}>Order: 2</span>
        </Space>
      ),
      extra: <DeleteOutlined style={{ color: "red" }} />,
      children: (
        <>
          <div style={{ marginBottom: 8, fontWeight: 500 }}>Config JSON</div>

          <TextArea
            value={productFeature}
            onChange={(e) => setProductFeature(e.target.value)}
            rows={8}
            style={{
              fontFamily: "monospace",
              borderRadius: 8,
            }}
          />

          <div
            style={{ textAlign: "right", marginTop: 12, marginBottom: "10px" }}
          >
            <Button type="primary" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </>
      ),
    },
  ];

  const item_3 = [
    {
      key: "3",
      label: (
        <Space
          style={{
            background: "white",
          }}
        >
          <SettingOutlined />
          <strong>testimonials</strong>
          <span style={{ color: "#999" }}>reviews</span>
          <span style={{ color: "#999" }}>Order: 3</span>
        </Space>
      ),
      extra: <DeleteOutlined style={{ color: "red" }} />,
      children: (
        <>
          <div style={{ marginBottom: 8, fontWeight: 500 }}>Config JSON</div>

          <TextArea
            value={testimonials}
            onChange={(e) => setTestimonials(e.target.value)}
            rows={8}
            style={{
              fontFamily: "monospace",
              borderRadius: 8,
            }}
          />

          <div
            style={{ textAlign: "right", marginTop: 12, marginBottom: "10px" }}
          >
            <Button type="primary" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </>
      ),
    },
  ];

  const item_4 = [
    {
      key: "3",
      label: (
        <Space
          style={{
            background: "white",
          }}
        >
          <SettingOutlined />
          <strong>newsletter</strong>
          <span style={{ color: "#999" }}>newsletter-signup</span>
          <span style={{ color: "#999" }}>Order: 4</span>
        </Space>
      ),
      extra: <DeleteOutlined style={{ color: "red" }} />,
      children: (
        <>
          <div style={{ marginBottom: 8, fontWeight: 500 }}>Config JSON</div>

          <TextArea
            value={newsletter}
            onChange={(e) => setNewsletter(e.target.value)}
            rows={8}
            style={{
              fontFamily: "monospace",
              borderRadius: 8,
            }}
          />

          <div
            style={{ textAlign: "right", marginTop: 12, marginBottom: "10px" }}
          >
            <Button type="primary" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: "24px", background: "white" }}>
        <Collapse
          items={item_1}
          defaultActiveKey={["1"]}
          expandIconPlacement="end"
        />
      </div>

      {/* items- 2 */}
      <div style={{ marginBottom: "24px", background: "white" }}>
        <Collapse
          items={item_2}
          defaultActiveKey={["2"]}
          expandIconPlacement="end"
        />
      </div>

      {/* items- 3 */}
      <div style={{ marginBottom: "24px", background: "white" }}>
        <Collapse
          items={item_3}
          defaultActiveKey={["3"]}
          expandIconPlacement="end"
        />
      </div>

      {/* items-4 */}
      <div style={{ marginBottom: "24px", background: "white" }}>
        <Collapse
          items={item_4}
          defaultActiveKey={["3"]}
          expandIconPlacement="end"
        />
      </div>
    </div>
  );
}
