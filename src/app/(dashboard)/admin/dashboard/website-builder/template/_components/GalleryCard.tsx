"use client";

import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Card, Row, Col, Typography, Spin, Empty, Tag } from "antd";
import Link from "next/link";

const { Text } = Typography;

export default function GalleryCard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["website-templates"],
    queryFn: async () => {
      const res = await api.get("/website-templates");
      return res.data?.data?.data ?? [];
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spin />
      </div>
    );
  }

  if (isError) {
    return <Empty description="Failed to load templates" />;
  }

  if (!data.length) {
    return <Empty description="No templates found" />;
  }

  return (
    <Row gutter={[24, 24]}>
      {data.map((theme: any) => (
        <Col key={theme.id} xs={24} sm={12} md={8}>
          <Link href={`/admin/dashboard/website-builder/templates/${theme.id}`}>
            <Card
              hoverable
              cover={
                <img
                  src={theme.preview_image}
                  alt={theme.name}
                  style={{ height: 200, objectFit: "cover" }}
                />
              }
            >
              {/* Title + Category */}
              <div className="flex justify-between items-center mb-2">
                <Text strong>{theme.name}</Text>
                <Tag>{theme.category}</Tag>
              </div>

              {/* Slug */}
              <Text type="secondary" style={{ display: "block" }}>
                {theme.slug}
              </Text>

              {/* Description */}
              <Text type="secondary">{theme.description}</Text>

              {/* Status */}
              <div className="mt-2">
                <Tag color={theme.status === "Active" ? "green" : "red"}>
                  {theme.status}
                </Tag>
              </div>
            </Card>
          </Link>
        </Col>
      ))}
    </Row>
  );
}
