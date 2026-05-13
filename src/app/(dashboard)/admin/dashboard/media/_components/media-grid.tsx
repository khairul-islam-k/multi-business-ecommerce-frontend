"use client";

import { Col, Row } from "antd";

import type { ApiId, MediaAsset } from "@/lib/api";
import MediaCard from "./media-card";

type MediaGridProps = {
  assets: MediaAsset[];
  selectedIds: ApiId[];
  canDelete: boolean;
  deletingId?: ApiId;
  onCopy: (url: string) => void;
  onDelete: (asset: MediaAsset) => void;
  onSelectionChange: (assetId: ApiId, checked: boolean) => void;
};

export default function MediaGrid({
  assets,
  selectedIds,
  canDelete,
  deletingId,
  onCopy,
  onDelete,
  onSelectionChange,
}: MediaGridProps) {
  const selectedSet = new Set(selectedIds);

  return (
    <Row gutter={[16, 16]}>
      {assets.map((asset) => (
        <Col key={asset.id} xs={24} sm={12} lg={8} xl={6}>
          <MediaCard
            asset={asset}
            selected={selectedSet.has(asset.id)}
            canDelete={canDelete}
            deleting={deletingId === asset.id}
            onCopy={onCopy}
            onDelete={onDelete}
            onSelectionChange={onSelectionChange}
          />
        </Col>
      ))}
    </Row>
  );
}
