"use client";

import { useMemo, useState } from "react";
import { ReloadOutlined } from "@ant-design/icons";
import { Button, Card, Empty, Form } from "antd";
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
import MediaGrid from "./_components/media-grid";
import MediaToolbar from "./_components/media-toolbar";
import MediaUploadPanel from "./_components/media-upload-panel";
import { fileName } from "./_utils/media";

export default function MediaLibraryPage() {
  const [form] = Form.useForm();
  const swal = useSwal();
  const businessId = useActiveBusinessId();

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

  const handleCopyUrl = (url: string) => {
    navigator.clipboard?.writeText(url);
    swal.success("Media URL copied.");
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
