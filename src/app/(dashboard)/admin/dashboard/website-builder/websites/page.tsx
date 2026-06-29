"use client";

import {
  CircleCheck,
  CirclePlus,
  CircleStop,
  Globe
} from "lucide-react";


import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Empty,
  Input,
  Modal,
  Row,
  Skeleton,
  Space,
  Tag,
  Tooltip,
  Typography,
} from "antd";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useWebsiteMutation, useWebsiteQuery } from "@/lib/api/hooks/website";
import { useAuthStore } from "@/stores/auth.store";
import { ResponseWebsite, ResponseWebsiteDomain } from "@/types/website/website";
import { imageUrlSet } from "../../product-catalog/products/_components/image-url";
import { useSwal } from "@/hooks/use-swal";
import { getApiErrorMessage } from "@/lib/axios";
import { useState } from "react";
import WebsiteDomainCreateForm from "./_components/website-domain-create-form";
import { usePermissionAccess } from "@/hooks/use-permission-access";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { CopyOutlined } from "@ant-design/icons";


const { Text, Title, Paragraph } = Typography;

const getStatusColor = (status?: string) => {
  switch (status) {
    case "PUBLISHED":
      return "green";
    case "DRAFT":
      return "blue";
    case "UNPUBLISHED":
      return "orange";
    case "ARCHIVED":
      return "red";
    default:
      return "default";
  }
};

const getFirstWebsite = (
  websites?: ResponseWebsite[] | ResponseWebsite,
): ResponseWebsite | undefined => {
  if (!websites) return undefined;

  if (Array.isArray(websites)) {
    return websites[0];
  }

  return websites;
};

const getActiveSubDomain = (domains: ResponseWebsiteDomain[]) => {
  const activeSubDomain = domains.find(
    (item) => item.isPrimary === true,
  );

  return activeSubDomain?.subdomain ?? null;
};

const WebsiteList = () => {
  const router = useRouter();

  const business = useAuthStore((state) => state.selectedBusiness);
  const businessId = business?.id ?? "";
  const swal = useSwal();
  const createAccess = usePermissionAccess(PERMISSIONS.websiteCreate);
  const updateAccess = usePermissionAccess(PERMISSIONS.websiteUpdate);
  const deleteAccess = usePermissionAccess(PERMISSIONS.websiteDelete);

  // domain modal
  const [openDomainModal, setOpenDomainModal] = useState<boolean>(false);
  const [websiteId, setWebsiteId] = useState<string>('');

  const {
    data: websites,
    isLoading,
    isFetching,
  } = useWebsiteQuery(businessId);

  console.log('website', websites);

  const website = getFirstWebsite(websites?.items);

  // TODO:
  const activeSubDomain = getActiveSubDomain(website?.domains ?? []);

  const storeUrl = activeSubDomain
    ? `http://${activeSubDomain}:3000/store`
    : "";

  const handleCopyStoreUrl = async () => {
    if (!storeUrl) {
      swal.error("Store URL not found");
      return;
    }

    await navigator.clipboard.writeText(storeUrl);
    swal.success("Store URL copied");
  };

  const { removeWebsite, updatePublish, updateUnPublish } = useWebsiteMutation(businessId);

  const logoUrl = website?.theme?.logoUrl;
  const faviconUrl = website?.theme?.faviconUrl;
  const headerSlides = website?.config?.headerConfig?.slide ?? [];
  const bestOfferImages =
    website?.config?.generalConfig?.bestOfferImages ?? [];
  const partners = website?.config?.generalConfig?.partners ?? [];

  // delete website

  const handleDeleteWebsite = (id: string) => {
    swal.modal.confirm({
      title: "Delete website?",
      content: "This website will be deleted permanently.",
      okText: "Delete",
      cancelText: "Cancel",
      centered: true,
      okButtonProps: {
        danger: true,
      },
      async onOk() {
        try {
          await removeWebsite.mutateAsync(id);

          swal.success("Website deleted successfully.");
        } catch (error) {
          swal.error(getApiErrorMessage(error));
        }
      },
    });
  };

  // publish and unpublish
  const handlePublishWebsite = (id: string) => {
    swal.modal.confirm({
      title: "Publish website?",
      content: "This website will be visible as published.",
      okText: "Publish",
      cancelText: "Cancel",
      centered: true,
      async onOk() {
        try {
          await updatePublish.mutateAsync(id);

          swal.success("Website published successfully.");
        } catch (error) {
          swal.error(getApiErrorMessage(error));
        }
      },
    });
  };

  const handleUnpublishWebsite = (id: string) => {
    swal.modal.confirm({
      title: "Unpublish website?",
      content: "This website will be moved to unpublished status.",
      okText: "Unpublish",
      cancelText: "Cancel",
      centered: true,
      okButtonProps: {
        danger: true,
      },
      async onOk() {
        try {
          await updateUnPublish.mutateAsync(id);

          swal.success("Website unpublished successfully.");
        } catch (error) {
          swal.error(getApiErrorMessage(error));
        }
      },
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Websites" breadcrumb={adminBreadcrumb} />

      <div className="flex items-center justify-between gap-4">
        <div>
          <Title level={4} className="!mb-1">
            Website Builder
          </Title>

          <Text type="secondary">
            Manage your business website template, theme and SEO.
          </Text>
        </div>

        {createAccess.allowed ? (
          <Button
            type="primary"
            icon={<CirclePlus />}
            onClick={() =>
              router.push(
                "/admin/dashboard/website-builder/websites/create-website",
              )
            }
          >
            Create Website
          </Button>
        ) : null}
      </div>

      {isLoading || isFetching ? (
        <Card>
          <Skeleton active paragraph={{ rows: 8 }} />
        </Card>
      ) : !website ? (
        <Card>
          <Empty
            description="No website found"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            {createAccess.allowed ? (
              <Button
                type="primary"
                icon={<CirclePlus />}
                onClick={() =>
                  router.push(
                    "/admin/dashboard/website-builder/websites/create-website",
                  )
                }
              >
                Create Website
              </Button>
            ) : null}
          </Empty>
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={8}>
            <Card
              hoverable
              className="h-full overflow-hidden rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              styles={{
                body: {
                  padding: 0,
                },
              }}
            >
              <div className="flex h-full flex-col">
                {/* Header */}
                <div className="border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <Title level={4} className="!mb-1 truncate !text-gray-950">
                        {website.name}
                      </Title>

                      <Text type="secondary" className="text-sm">
                        /{website.slug}
                      </Text>
                    </div>

                    <Tag
                      color={getStatusColor(website.status)}
                      className="rounded-full px-3 py-1 text-xs font-semibold"
                    >
                      {website.status}
                    </Tag>
                  </div>
                </div>

                {/* Logo */}
                <div className="p-5">
                  <div className="flex h-24 items-center justify-center rounded-2xl border border-gray-100 bg-gray-50">
                    {logoUrl ? (
                      <Image
                        src={imageUrlSet(logoUrl)}
                        alt={website.name}
                        width={180}
                        height={72}
                        className="max-h-16 w-auto object-contain"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-16 w-full items-center justify-center rounded-xl bg-white text-sm font-medium text-gray-400">
                        No Logo
                      </div>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="px-5">
                  <div className="grid gap-3 rounded-2xl border border-gray-100 bg-white p-4">
                    <div className="flex items-center justify-between gap-3">
                      <Text type="secondary" className="text-sm">
                        Template
                      </Text>

                      <Tag color="blue" className="m-0 rounded-full">
                        {website.template}
                      </Tag>
                    </div>

                    <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-3">
                      <Text type="secondary" className="text-sm">
                        Business
                      </Text>

                      <Text strong className="max-w-[160px] truncate text-right">
                        {website.business?.name ?? "-"}
                      </Text>
                    </div>

                    <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-3">
                      <Text type="secondary" className="text-sm">
                        Meta Title
                      </Text>

                      <Text strong className="max-w-[160px] truncate text-right">
                        {website.seo?.metaTitle ?? "-"}
                      </Text>
                    </div>

                    <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-3">
                      <Text type="secondary" className="text-sm">
                        Version
                      </Text>

                      <Text strong>
                        {website.currentVersion?.versionNo
                          ? `Version ${website.currentVersion.versionNo}`
                          : "-"}
                      </Text>
                    </div>
                  </div>
                </div>

                {/* Domain URL */}
                <div className="px-5 pt-5">
                  <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <Text strong className="text-sm text-gray-900">
                        Store Domain
                      </Text>

                      <Tag color={storeUrl ? "green" : "default"} className="m-0">
                        {storeUrl ? "Available" : "Not Set"}
                      </Tag>
                    </div>

                    <Input
                      readOnly
                      value={storeUrl}
                      placeholder="Store URL not available"
                      className="rounded-xl"
                      addonAfter={
                        <Tooltip title="Copy URL">
                          <Button
                            type="text"
                            size="small"
                            icon={<CopyOutlined />}
                            onClick={handleCopyStoreUrl}
                            disabled={!storeUrl}
                          />
                        </Tooltip>
                      }
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-auto p-5">
                  <div className="flex flex-wrap gap-2">
                    {updateAccess.allowed ? (
                      <>
                        <Button
                          className="rounded-lg"
                          onClick={() =>
                            router.push(
                              `/admin/dashboard/website-builder/websites/edit/${website.id}`,
                            )
                          }
                        >
                          Edit
                        </Button>

                        {website.status === "PUBLISHED" ? (
                          <Button
                            danger
                            className="rounded-lg"
                            icon={<CircleStop />}
                            loading={updateUnPublish.isPending}
                            onClick={() => handleUnpublishWebsite(website.id)}
                          >
                            Unpublish
                          </Button>
                        ) : (
                          <Button
                            type="primary"
                            className="rounded-lg"
                            icon={<CircleCheck />}
                            loading={updatePublish.isPending}
                            disabled={website.status === "ARCHIVED"}
                            onClick={() => handlePublishWebsite(website.id)}
                          >
                            Publish
                          </Button>
                        )}

                        <Button
                          type="primary"
                          className="rounded-lg bg-indigo-600 hover:!bg-indigo-700"
                          icon={<CirclePlus />}
                          onClick={() => {
                            setOpenDomainModal(true);
                            setWebsiteId(website.id);
                          }}
                        >
                          Add Domain
                        </Button>
                      </>
                    ) : null}

                    {deleteAccess.allowed ? (
                      <Button
                        danger
                        className="rounded-lg"
                        onClick={() => handleDeleteWebsite(website.id)}
                      >
                        Delete
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={16}>
            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <Card title="Theme">
                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={8}>
                      <Text type="secondary">Primary Color</Text>

                      <div className="mt-2 flex items-center gap-2">
                        <span
                          className="inline-block h-6 w-6 rounded border"
                          style={{
                            backgroundColor:
                              website.theme?.primaryColor ?? "var(--dashboard-card-background-color)",
                          }}
                        />

                        <Text>{website.theme?.primaryColor ?? "-"}</Text>
                      </div>
                    </Col>

                    <Col xs={24} md={8}>
                      <Text type="secondary">Secondary Color</Text>

                      <div className="mt-2 flex items-center gap-2">
                        <span
                          className="inline-block h-6 w-6 rounded border"
                          style={{
                            backgroundColor:
                              website.theme?.secondaryColor ?? "var(--dashboard-card-background-color)",
                          }}
                        />

                        <Text>{website.theme?.secondaryColor ?? "-"}</Text>
                      </div>
                    </Col>

                    <Col xs={24} md={8}>
                      <Text type="secondary">Accent Color</Text>

                      <div className="mt-2 flex items-center gap-2">
                        <span
                          className="inline-block h-6 w-6 rounded border"
                          style={{
                            backgroundColor:
                              website.theme?.accentColor ?? "var(--dashboard-card-background-color)",
                          }}
                        />

                        <Text>{website.theme?.accentColor ?? "-"}</Text>
                      </div>
                    </Col>

                    <Col xs={24} md={8}>
                      <Text type="secondary">Font Family</Text>

                      <Paragraph className="!mb-0 !mt-2">
                        {website.theme?.fontFamily ?? "-"}
                      </Paragraph>
                    </Col>

                    <Col xs={24} md={8}>
                      <Text type="secondary">Favicon</Text>

                      <div className="mt-2">
                        {faviconUrl ? (
                          <Image
                            src={imageUrlSet(faviconUrl)}
                            alt="favicon"
                            width={32}
                            height={32}
                            className="h-8 w-8 rounded object-contain"
                            unoptimized
                          />
                        ) : (
                          <Text>-</Text>
                        )}
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>

              <Col xs={24}>
                <Card title="Header Slides">
                  {headerSlides.length ? (
                    <Row gutter={[16, 16]}>
                      {headerSlides.map((slide, index) => (
                        <Col xs={24} md={8} key={slide.id ?? index}>
                          <Card size="small" className="h-full">
                            <div className="space-y-3">
                              {slide.imageUrl ? (
                                <Image
                                  src={imageUrlSet(slide.imageUrl)}
                                  alt={slide.title ?? "Slide image"}
                                  width={400}
                                  height={180}
                                  className="h-36 w-full rounded-lg object-cover"
                                  unoptimized
                                />
                              ) : (
                                <div className="flex h-36 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                                  No Image
                                </div>
                              )}

                              <div>
                                <Text strong>{slide.title ?? "-"}</Text>

                                <Paragraph className="!mb-1 !mt-1 text-sm">
                                  {slide.subTitle ?? "-"}
                                </Paragraph>

                                <Text type="secondary">
                                  {slide.buttonText ?? "-"}
                                </Text>
                              </div>
                            </div>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <Empty
                      description="No header slide found"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  )}
                </Card>
              </Col>

              <Col xs={24} md={12}>
                <Card title="Footer Config" className="h-full">
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Title">
                      {website.config?.footerConfig?.title ?? "-"}
                    </Descriptions.Item>

                    <Descriptions.Item label="Email">
                      {website.config?.footerConfig?.email ?? "-"}
                    </Descriptions.Item>

                    <Descriptions.Item label="Phone">
                      {website.config?.footerConfig?.phone ?? "-"}
                    </Descriptions.Item>

                    <Descriptions.Item label="Address">
                      {website.config?.footerConfig?.address ?? "-"}
                    </Descriptions.Item>

                    <Descriptions.Item label="Copyright">
                      {website.config?.footerConfig?.copyrightText ?? "-"}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>

              <Col xs={24} md={12}>
                <Card title="SEO" className="h-full">
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Meta Title">
                      {website.seo?.metaTitle ?? "-"}
                    </Descriptions.Item>

                    <Descriptions.Item label="Meta Keywords">
                      {website.seo?.metaKeywords ?? "-"}
                    </Descriptions.Item>

                    <Descriptions.Item label="OG Title">
                      {website.seo?.ogTitle ?? "-"}
                    </Descriptions.Item>

                    <Descriptions.Item label="Canonical URL">
                      {website.seo?.canonicalUrl ?? "-"}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>

              <Col xs={24}>
                <Card title="Best Offer Images">
                  {bestOfferImages.length ? (
                    <Row gutter={[16, 16]}>
                      {bestOfferImages.map((item, index) => (
                        <Col
                          xs={24}
                          md={item.size === "large" ? 12 : 6}
                          key={item.id ?? index}
                        >
                          {item.imageUrl ? (
                            <Image
                              src={imageUrlSet(item.imageUrl)}
                              alt={`Best offer ${index + 1}`}
                              width={item.size === "large" ? 600 : 300}
                              height={item.size === "large" ? 260 : 120}
                              className={`w-full rounded-xl object-cover ${item.size === "large" ? "h-64" : "h-28"
                                }`}
                              unoptimized
                            />
                          ) : (
                            <div
                              className={`flex w-full items-center justify-center rounded-xl bg-gray-100 text-gray-400 ${item.size === "large" ? "h-64" : "h-28"
                                }`}
                            >
                              No Image
                            </div>
                          )}
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <Empty
                      description="No best offer images found"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  )}
                </Card>
              </Col>

              <Col xs={24}>
                <Card title="Partners">
                  {partners.length ? (
                    <div className="flex flex-wrap gap-4">
                      {partners.map((partner, index) => (
                        <div
                          key={`${partner}-${index}`}
                          className="flex h-20 w-32 items-center justify-center rounded-xl border bg-white p-3"
                        >
                          {partner ? (
                            <Image
                              src={imageUrlSet(partner)}
                              alt={`Partner ${index + 1}`}
                              width={100}
                              height={60}
                              className="max-h-full max-w-full object-contain"
                              unoptimized
                            />
                          ) : (
                            <Globe className="text-xl text-gray-400" />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Empty
                      description="No partners found"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  )}
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      )}

      <Modal
        title="Add Website Domain"
        open={openDomainModal}
        onCancel={() => setOpenDomainModal(false)}
        footer={null}
        destroyOnHidden
        centered
        width={720}
      >
        <WebsiteDomainCreateForm
          websiteId={websiteId}
          setOpenDomainModal={setOpenDomainModal}
        />
      </Modal>
    </div>
  );
};

export default WebsiteList;
