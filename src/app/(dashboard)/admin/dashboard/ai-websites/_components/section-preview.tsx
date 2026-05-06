"use client";

import { Card, Typography, Row, Col, Button, Input } from "antd";
import {
  ThunderboltOutlined,
  SafetyOutlined,
  GlobalOutlined,
  MessageOutlined,
} from "@ant-design/icons";

import type { GeneratedSection } from "../types";

const { Title, Text, Paragraph } = Typography;

const iconMap: Record<string, React.ReactNode> = {
  zap: <ThunderboltOutlined />,
  shield: <SafetyOutlined />,
  globe: <GlobalOutlined />,
};

export function SectionPreview({ section }: { section: GeneratedSection }) {
  const cfg = section.config_json as any;

  switch (section.section_type) {
    case "hero":
      return (
        <Card bordered={false} style={{ textAlign: "center" }}>
          <Title>{cfg.headline}</Title>
          {cfg.subheadline && <Paragraph>{cfg.subheadline}</Paragraph>}
          {cfg.cta_label && <Button type="primary">{cfg.cta_label}</Button>}
        </Card>
      );

    case "features":
      return (
        <Card bordered={false}>
          {cfg.title && <Title level={3}>{cfg.title}</Title>}
          <Row gutter={[16, 16]}>
            {cfg.items?.map((item: any, i: number) => (
              <Col xs={24} sm={8} key={i}>
                <Card>
                  <div style={{ fontSize: 20, marginBottom: 8 }}>
                    {iconMap[item.icon] || <ThunderboltOutlined />}
                  </div>
                  <Text strong>{item.title}</Text>
                  <Paragraph type="secondary">{item.description}</Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      );

    case "testimonials":
      return (
        <Card>
          {cfg.title && <Title level={3}>{cfg.title}</Title>}
          <Row gutter={[16, 16]}>
            {cfg.items?.map((item: any, i: number) => (
              <Col xs={24} sm={12} key={i}>
                <Card>
                  <MessageOutlined />
                  <Paragraph italic>"{item.quote}"</Paragraph>
                  <Text strong>{item.name}</Text>
                  <br />
                  <Text type="secondary">{item.role}</Text>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      );

    case "cta":
      return (
        <Card style={{ textAlign: "center" }}>
          <Title level={3}>{cfg.headline}</Title>
          <Button type="primary">{cfg.cta_label}</Button>
        </Card>
      );

    case "text":
      return (
        <Card>
          <Title level={3}>{cfg.title}</Title>
          <Paragraph>{cfg.body}</Paragraph>
        </Card>
      );

    case "form":
      return (
        <Card>
          <Title level={3}>{cfg.title}</Title>
          {cfg.fields?.map((f: string) => (
            <div key={f} style={{ marginBottom: 12 }}>
              {f === "message" ? (
                <Input.TextArea placeholder={f} />
              ) : (
                <Input placeholder={f} />
              )}
            </div>
          ))}
          <Button type="primary">Submit</Button>
        </Card>
      );

    default:
      return <Card>{section.section_type}</Card>;
  }
}
