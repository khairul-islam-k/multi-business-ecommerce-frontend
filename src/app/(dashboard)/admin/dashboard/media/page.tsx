"use client";

import { useMemo, useState } from "react";
import {
  CopyOutlined,
  DeleteOutlined,
  InboxOutlined,
  ReloadOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Empty,
  Flex,
  Form,
  Image,
  Input,
  Row,
  Select,
  Space,
  Tag,
  Typography,
  Upload,
  theme,
} from "antd";
import type { UploadFile } from "antd/es/upload/interface";

import { getApiErrorMessage } from "@/lib/axios";
import { useActiveBusinessId } from "@/hooks/use-active-business";
import { useMediaAssets, useMediaMutations } from "@/lib/api";
import type { ApiId, MediaAsset, MediaQuery } from "@/lib/api";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import Loader from "@/components/shared/loader";
import Pagination from "@/components/shared/pagination";
import { useSwal } from "@/hooks/use-swal";
import { usePermissionAccess } from "@/hooks/use-permission-access";
import { PERMISSIONS } from "@/lib/auth/permissions";

const { Dragger } = Upload;
const { Text, Title } = Typography;

const apiOrigin = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_API_BASE_URL ?? "").origin;
  } catch {
    return "";
  }
})();

function mediaUrl(asset: MediaAsset) {
  const value = asset.fileUrl;

  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("/")) return `${apiOrigin}${value}`;

  return value;
}

function formatFileSize(size?: number | null) {
  if (!size) return "Unknown size";

  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;

  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

function fileName(asset: MediaAsset) {
  return asset.fileName;
}

export default function MediaLibraryPage() {
  const [form] = Form.useForm();
  const swal = useSwal();
  const businessId = useActiveBusinessId();
  const { token } = theme.useToken();

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [tags, setTags] = useState("");
  const [sortBy, setSortBy] = useState<MediaQuery["sortBy"]>("createdAt");
  const [sortOrder, setSortOrder] = useState<MediaQuery["sortOrder"]>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<ApiId[]>([]);

  const createAccess = usePermissionAccess(PERMISSIONS.mediaCreate);
  const deleteAccess = usePermissionAccess(PERMISSIONS.mediaDelete);

  const query = useMemo<MediaQuery>(
    () => ({
      page: currentPage,
      limit: 12,
      tags: tags.trim(),
      sortBy,
      sortOrder,
    }),
    [currentPage, sortBy, sortOrder, tags],
  );

  const { data, isLoading, isFetching, refetch } = useMediaAssets(
    businessId,
    query,
  );
  const { uploadMedia, uploadMediaBulk, removeMedia, removeMediaBulk } =
    useMediaMutations(businessId);

  const assets = data?.items ?? [];
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const busy =
    uploadMedia.isPending ||
    uploadMediaBulk.isPending ||
    removeMedia.isPending ||
    removeMediaBulk.isPending;

  const handleUpload = async (values: { altText?: string; tags?: string }) => {
    if (!businessId) return;

    const files = fileList
      .map((file) => file.originFileObj)
      .filter(Boolean) as File[];

    if (!files.length) {
      swal.error("Choose at least one image to upload.");
      return;
    }

    try {
      if (files.length === 1) {
        await uploadMedia.mutateAsync({
          file: files[0],
          altText: values.altText,
          tags: values.tags,
        });
      } else {
        await uploadMediaBulk.mutateAsync({
          files,
          altText: values.altText,
          tags: values.tags,
        });
      }

      setFileList([]);
      form.resetFields();
      swal.success("Media uploaded successfully.");
    } catch (error) {
      swal.error(getApiErrorMessage(error));
    }
  };

  const handleDelete = async (asset: MediaAsset) => {
    if (!businessId || !deleteAccess.allowed) return;

    const { isConfirmed } = await swal.confirm({
      title: "Delete media asset?",
      text: `${fileName(asset)} will be removed from this business library.`,
      confirmButtonText: "Delete image",
    });

    if (!isConfirmed) return;

    try {
      await removeMedia.mutateAsync(asset.id);
      setSelectedIds((ids) => ids.filter((id) => id !== asset.id));
      swal.success("Media asset deleted successfully.");
    } catch (error) {
      swal.error(getApiErrorMessage(error));
    }
  };

  const handleBulkDelete = async () => {
    if (!businessId || !selectedIds.length || !deleteAccess.allowed) return;

    const { isConfirmed } = await swal.confirm({
      title: "Delete selected media?",
      text: `${selectedIds.length} image(s) will be removed from this business library.`,
      confirmButtonText: "Delete selected",
    });

    if (!isConfirmed) return;

    try {
      await removeMediaBulk.mutateAsync(selectedIds);
      setSelectedIds([]);
      swal.success("Selected media deleted successfully.");
    } catch (error) {
      swal.error(getApiErrorMessage(error));
    }
  };

  const toggleSelection = (assetId: ApiId, checked: boolean) => {
    setSelectedIds((ids) =>
      checked
        ? [...new Set([...ids, assetId])]
        : ids.filter((id) => id !== assetId),
    );
  };

  if (!businessId) {
    return (
      <Empty description="Select or create a business before managing media." />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Media Library"
        subtitle="Upload, organize, copy, and remove reusable images for the active business."
        breadcrumb={adminBreadcrumb}
        actions={
          <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
            Refresh
          </Button>
        }
      />

      <Card>
        <Form form={form} layout="vertical" onFinish={handleUpload}>
          <Row gutter={[16, 8]}>
            <Col xs={24} lg={10}>
              <Form.Item
                label="Images"
                required
                tooltip="Choose one or more images for this business."
              >
                <Dragger
                  accept="image/*"
                  beforeUpload={() => false}
                  disabled={!createAccess.allowed || busy}
                  fileList={fileList}
                  multiple
                  onChange={({ fileList: nextFiles }) => setFileList(nextFiles)}
                  showUploadList={{ showRemoveIcon: true }}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Drop images here</p>
                  <p className="ant-upload-hint">
                    Upload single images or a small batch with shared metadata.
                  </p>
                </Dragger>
              </Form.Item>
            </Col>

            <Col xs={24} lg={14}>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item label="Alt text" name="altText">
                    <Input placeholder="Hero banner, storefront logo..." />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label="Tags" name="tags">
                    <Input placeholder="hero,banner,homepage" />
                  </Form.Item>
                </Col>
              </Row>

              <Button
                disabled={!createAccess.allowed}
                htmlType="submit"
                icon={<UploadOutlined />}
                loading={uploadMedia.isPending || uploadMediaBulk.isPending}
                type="primary"
              >
                Upload media
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card>
        <Flex gap={12} justify="space-between" wrap="wrap">
          <Space wrap>
            <Input
              allowClear
              placeholder="Filter by tags"
              style={{ width: 220 }}
              value={tags}
              onChange={(event) => {
                setTags(event.target.value);
                setCurrentPage(1);
              }}
            />

            <Select
              value={sortBy}
              style={{ width: 150 }}
              onChange={(value) => {
                setSortBy(value);
                setCurrentPage(1);
              }}
              options={[
                { label: "Newest", value: "createdAt" },
                { label: "File name", value: "fileName" },
                { label: "File size", value: "fileSize" },
              ]}
            />

            <Select
              value={sortOrder}
              style={{ width: 120 }}
              onChange={(value) => {
                setSortOrder(value);
                setCurrentPage(1);
              }}
              options={[
                { label: "Desc", value: "desc" },
                { label: "Asc", value: "asc" },
              ]}
            />
          </Space>

          <Button
            danger
            disabled={!selectedIds.length || !deleteAccess.allowed}
            icon={<DeleteOutlined />}
            loading={removeMediaBulk.isPending}
            onClick={handleBulkDelete}
          >
            Delete selected
          </Button>
        </Flex>
      </Card>

      {isLoading ? (
        <Loader
          label="Loading media"
          description="Fetching the active business media library."
        />
      ) : assets.length ? (
        <>
          <Row gutter={[16, 16]}>
            {assets.map((asset) => {
              const src = mediaUrl(asset);

              return (
                <Col key={asset.id} xs={24} sm={12} lg={8} xl={6}>
                  <Card
                    hoverable
                    styles={{ body: { padding: 14 } }}
                    style={{
                      borderColor: selectedSet.has(asset.id)
                        ? token.colorPrimary
                        : token.colorBorderSecondary,
                    }}
                    cover={
                      <div
                        className="relative flex aspect-[4/3] items-center justify-center overflow-hidden"
                        style={{ background: token.colorFillTertiary }}
                      >
                        <Checkbox
                          checked={selectedSet.has(asset.id)}
                          className="absolute left-3 top-3 z-10"
                          disabled={!deleteAccess.allowed}
                          onChange={(event) =>
                            toggleSelection(asset.id, event.target.checked)
                          }
                        />
                        {src ? (
                          <Image
                            alt={asset.altText || fileName(asset)}
                            src={src}
                            height="100%"
                            width="100%"
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        )}
                      </div>
                    }
                  >
                    <div className="space-y-3">
                      <div className="min-w-0">
                        <Title
                          level={5}
                          ellipsis={{ rows: 1 }}
                          style={{ margin: 0 }}
                        >
                          {fileName(asset)}
                        </Title>
                        <Text type="secondary">
                          {formatFileSize(asset.fileSize)}
                        </Text>
                      </div>

                      {asset.altText && (
                        <Text type="secondary" className="block" ellipsis>
                          {asset.altText}
                        </Text>
                      )}

                      <Flex gap={6} wrap="wrap">
                        {tags.length ? (
                          asset.tags?.map((tag) => (
                            <Tag key={tag.id}>{tag.name}</Tag>
                          ))
                        ) : (
                          <Tag>untagged</Tag>
                        )}
                      </Flex>

                      <Flex gap={8} justify="space-between">
                        <Button
                          icon={<CopyOutlined />}
                          onClick={() => {
                            navigator.clipboard?.writeText(src);
                            swal.success("Media URL copied.");
                          }}
                        >
                          Copy URL
                        </Button>

                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          loading={
                            removeMedia.isPending &&
                            removeMedia.variables === asset.id
                          }
                          disabled={!deleteAccess.allowed}
                          onClick={() => handleDelete(asset)}
                        />
                      </Flex>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>

          {data && data.meta.totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={data.meta.totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      ) : (
        <Card>
          <Empty
            description={
              isFetching
                ? "Refreshing media library..."
                : "No media assets found for this business."
            }
          />
        </Card>
      )}
    </div>
  );
}
