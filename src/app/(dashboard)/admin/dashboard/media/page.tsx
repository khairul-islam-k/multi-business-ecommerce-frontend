"use client";

import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import { ReloadOutlined } from "@ant-design/icons";
import { App, Button, Card, Empty, Form, theme } from "antd";
import type { UploadFile } from "antd/es/upload/interface";

import { getApiErrorMessage } from "@/lib/axios";
import { useActiveBusinessId } from "@/hooks/use-active-business";
import { useMediaAssets, useMediaMutations } from "@/lib/api";
import type { ApiId, MediaAsset, MediaQuery } from "@/lib/api";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import Loader from "@/components/shared/loader";
import Pagination from "@/components/shared/pagination";
import { usePermissionAccess } from "@/hooks/use-permission-access";
import { PERMISSIONS } from "@/lib/auth/permissions";
import MediaGrid from "./_components/media-grid";
import MediaToolbar from "./_components/media-toolbar";
import MediaUploadPanel from "./_components/media-upload-panel";
import { fileName } from "./_utils/media";

export default function MediaLibraryPage() {
  const [form] = Form.useForm();
  const { message, modal } = App.useApp();
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

      console.log('image', files);

    if (!files.length) {
      message.error("Choose at least one image to upload.");
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
      message.success("Media uploaded successfully.");
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
  };

  const handleDelete = async (asset: MediaAsset) => {
    if (!businessId || !deleteAccess.allowed) return;

    modal.confirm({
      title: "Delete media asset?",
      content: `${fileName(asset)} will be removed from this business library.`,
      okText: "Delete image",
      cancelText: "Cancel",
      centered: true,
      okButtonProps: {
        danger: true,
      },
      async onOk() {
        try {
          await removeMedia.mutateAsync(asset.id);

          setSelectedIds((ids) => ids.filter((id) => id !== asset.id));

          message.success("Media asset deleted successfully.");
        } catch (error) {
          message.error(getApiErrorMessage(error));
        }
      },
    });
  };

  const handleBulkDelete = () => {
  if (!businessId || !selectedIds.length || !deleteAccess.allowed) return;

  modal.confirm({
    title: "Delete selected media?",
    content: `${selectedIds.length} image(s) will be removed from this business library.`,
    okText: "Delete selected",
    cancelText: "Cancel",
    centered: true,
    okButtonProps: {
      danger: true,
    },
    async onOk() {
      try {
        await removeMediaBulk.mutateAsync(selectedIds);

        setSelectedIds([]);

        message.success("Selected media deleted successfully.");
      } catch (error) {
        message.error(getApiErrorMessage(error));
      }
    },
  });
};

  const toggleSelection = (assetId: ApiId, checked: boolean) => {
    setSelectedIds((ids) =>
      checked
        ? [...new Set([...ids, assetId])]
        : ids.filter((id) => id !== assetId),
    );
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard?.writeText(url);
    message.success("Media URL copied.");
  };

  const mediaThemeStyle = {
    "--media-control-bg": token.colorBgContainer,
    "--media-control-hover-bg": token.controlItemBgHover,
    "--media-control-border": token.colorBorder,
    "--media-control-text": token.colorText,
    "--media-control-muted": token.colorTextSecondary,
    "--media-danger": token.colorError,
    "--media-danger-bg": token.colorFillTertiary,
  } as CSSProperties;

  if (!businessId) {
    return (
      <Empty description="Select or create a business before managing media." />
    );
  }

  return (
    <div className="media-theme-scope space-y-6" style={mediaThemeStyle}>
      <PageHeader
        title="Media Library"
        subtitle="Upload, organize, copy, and remove reusable images for the active business."
        breadcrumb={adminBreadcrumb}
        actions={
          <Button
            className="media-secondary-button"
            icon={<ReloadOutlined />}
            onClick={() => refetch()}
          >
            Refresh
          </Button>
        }
      />

      <MediaUploadPanel
        form={form}
        fileList={fileList}
        canUpload={Boolean(createAccess.allowed)}
        disabled={busy}
        loading={uploadMedia.isPending || uploadMediaBulk.isPending}
        onFileListChange={setFileList}
        onFinish={handleUpload}
      />

      <MediaToolbar
        tags={tags}
        sortBy={sortBy}
        sortOrder={sortOrder}
        selectedCount={selectedIds.length}
        canDelete={Boolean(deleteAccess.allowed)}
        deleting={removeMediaBulk.isPending}
        onTagsChange={(value) => {
          setTags(value);
          setCurrentPage(1);
        }}
        onSortByChange={(value) => {
          setSortBy(value);
          setCurrentPage(1);
        }}
        onSortOrderChange={(value) => {
          setSortOrder(value);
          setCurrentPage(1);
        }}
        onBulkDelete={handleBulkDelete}
      />

      {isLoading ? (
        <Loader
          label="Loading media"
          description="Fetching the active business media library."
        />
      ) : assets.length ? (
        <>
          <MediaGrid
            assets={assets}
            selectedIds={selectedIds}
            canDelete={Boolean(deleteAccess.allowed)}
            deletingId={removeMedia.variables}
            onCopy={handleCopyUrl}
            onDelete={handleDelete}
            onSelectionChange={toggleSelection}
          />

          {data && data.meta.totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={data.meta.totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      ) : (
        <Card
          style={{
            background: token.colorBgContainer,
            borderColor: token.colorBorderSecondary,
          }}
        >
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
