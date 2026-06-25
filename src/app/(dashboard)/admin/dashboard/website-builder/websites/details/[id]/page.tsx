"use client";

import { Button, Card, Col, Empty, Row, Tabs, Tag, Typography } from "antd";
import { FileText, Globe, LayoutTemplate, LinkIcon, Repeat2 } from "lucide-react";
import { useParams } from "next/navigation";

import Loader from "@/components/shared/loader";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useActiveBusinessId } from "@/hooks/use-active-business";
import { useWebsite } from "@/lib/api";
import WebsiteDomain from "../_components/website-domain";
import WebsiteMenu from "../_components/website-menu";
import WebsitePage from "../_components/website-page";

const { Text } = Typography;

const buildWebsiteUrl = (domain?: string | null, subdomain?: string | null) => {
  const host = domain ?? subdomain;
  if (!host) return undefined;
  const protocol = host.includes("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
};

export default function WebsiteDetails() {
  const { id } = useParams();
  const businessId = useActiveBusinessId();
  const websiteId = String(id ?? "");
  const website = useWebsite(businessId ?? "", websiteId);

  if (!businessId) return <Empty description="No active business selected" />;

  if (website.isLoading) {
    return <Loader label="Loading website" />;
  }

  if (website.isError || !website.data) {
    return <Empty description="Website not found" />;
  }

  const data = website.data;
  const primaryDomain = data.domains?.find((domain) => domain.isPrimary);
  const siteUrl = buildWebsiteUrl(primaryDomain?.domain, primaryDomain?.subdomain);
  const detailData = [
    {
      id: 1,
      Icon: FileText,
      count: data.config ? 1 : 0,
      title: "Config",
    },
    {
      id: 2,
      Icon: LayoutTemplate,
      count: Object.keys(data.config?.navigationConfig ?? {}).length,
      title: "Navigation",
    },
    {
      id: 3,
      Icon: Repeat2,
      count: data.domains?.length ?? 0,
      title: "Domains",
    },
    {
      id: 4,
      Icon: Globe,
      count: data.template ? 1 : 0,
      title: "Template",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title={data.name} breadcrumb={adminBreadcrumb} />

      <div style={{ textAlign: "right" }}>
        <Button
          icon={<LinkIcon size={16} />}
          href={siteUrl}
          target="_blank"
          disabled={!siteUrl}
        >
          Visit Site
        </Button>
      </div>

      <Card>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Text type="secondary">Domain</Text>
            <div>{primaryDomain?.domain ?? "-"}</div>
          </Col>

          <Col xs={24} md={12}>
            <Text type="secondary">Subdomain</Text>
            <div>{primaryDomain?.subdomain ?? "-"}</div>
          </Col>

          <Col xs={24} md={12}>
            <Text type="secondary">Status</Text>
            <div>
              <Tag>{data.status}</Tag>
            </div>
          </Col>

          <Col xs={24} md={12}>
            <Text type="secondary">Published</Text>
            <div>
              {data.currentVersion?.publishedAt
                ? new Date(data.currentVersion.publishedAt).toLocaleDateString()
                : "-"}
            </div>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        {detailData.map(({ Icon, ...item }) => (
          <Col xs={24} md={6} key={item.id}>
            <Card>
              <div className="flex items-center gap-3">
                <div
                  style={{
                    background: "var(--brand-secondary-color, var(--dashboard-disabled-background-color))",
                    height: 50,
                    width: 50,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 8,
                  }}
                >
                  <Icon size={24} />
                </div>

                <div>
                  <h3 style={{ margin: 0 }}>{item.count}</h3>
                  <p style={{ margin: 0 }}>{item.title}</p>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Card>
        <Tabs
          defaultActiveKey="config"
          items={[
            {
              key: "config",
              label: "Config",
              children: <WebsitePage website={data} />,
            },
            {
              key: "navigation",
              label: "Navigation",
              children: <WebsiteMenu website={data} />,
            },
            {
              key: "domains",
              label: "Domains",
              children: <WebsiteDomain website={data} />,
            },
          ]}
        />
      </Card>
    </div>
  );
}
