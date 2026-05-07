"use client";

import api from "@/lib/axios";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import {
  FileTextOutlined,
  GlobalOutlined,
  LayoutOutlined,
  RetweetOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Row, Tabs, Spin, Empty, Typography } from "antd";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import WebsitePage from "../_components/website-page";
import WebsiteMenu from "../_components/website-menu";
import WebsiteDomain from "../_components/website-domain";

const { Text } = Typography;

export default function WebsiteDetails() {
  const { id } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["website", id],
    queryFn: async () => {
      const res = await api.get(`/websites/${id}`);
      return res.data?.data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spin />
      </div>
    );
  }

  if (isError || !data) {
    return <Empty description="Website not found" />;
  }

  const detailData = [
    {
      id: 1,
      Icon: FileTextOutlined,
      count: data.pages_count ?? 0,
      title: "Pages",
    },
    {
      id: 2,
      Icon: LayoutOutlined,
      count: data.menus_count ?? 0,
      title: "Menus",
    },
    {
      id: 3,
      Icon: RetweetOutlined,
      count: data.domains_count ?? 0,
      title: "Domains",
    },
    {
      id: 4,
      Icon: GlobalOutlined,
      count: data.template_id ? 1 : 0,
      title: "Template",
    },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <PageHeader title={data.name} breadcrumb={adminBreadcrumb} />

      {/* TOP ACTION */}
      <div style={{ textAlign: "right" }}>
        <Button
          icon={<LinkOutlined />}
          href={
            data.domain
              ? `https://${data.domain}`
              : `https://${data.subdomain}.yourdomain.com`
          }
          target="_blank"
        >
          Visit Site
        </Button>
      </div>

      {/* BASIC INFO CARD */}
      <Card>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Text type="secondary">Domain</Text>
            <div>{data.domain || "—"}</div>
          </Col>

          <Col xs={24} md={12}>
            <Text type="secondary">Subdomain</Text>
            <div>{data.subdomain || "—"}</div>
          </Col>

          <Col xs={24} md={12}>
            <Text type="secondary">Status</Text>
            <div>{data.status}</div>
          </Col>

          <Col xs={24} md={12}>
            <Text type="secondary">Published</Text>
            <div>
              {data.published_at
                ? new Date(data.published_at).toLocaleDateString()
                : "—"}
            </div>
          </Col>
        </Row>
      </Card>

      {/* STATS */}
      <Row gutter={[16, 16]}>
        {detailData.map((item) => {
          const Icon = item.Icon;

          return (
            <Col xs={24} md={6} key={item.id}>
              <Card>
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      background: "#f5f5f5",
                      height: 50,
                      width: 50,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 10,
                    }}
                  >
                    <Icon style={{ fontSize: 24 }} />
                  </div>

                  <div>
                    <h3 style={{ margin: 0 }}>{item.count}</h3>
                    <p style={{ margin: 0 }}>{item.title}</p>
                  </div>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* TABS */}
      <Card>
        <Tabs
          defaultActiveKey="pages"
          items={[
            {
              key: "pages",
              label: "Pages",
              children: <WebsitePage websiteId={id as string} />,
            },
            {
              key: "menus",
              label: "Menus",
              children: <WebsiteMenu websiteId={id as string} />,
            },
            {
              key: "domains",
              label: "Domains",
              children: <WebsiteDomain websiteId={id as string} />,
            },
          ]}
        />
      </Card>
    </div>
  );
}
