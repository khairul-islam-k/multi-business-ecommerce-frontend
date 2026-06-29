"use client";

import {
  Trash2
} from "lucide-react";


import { Button, Card, Flex, Input, Select, Space, theme } from "antd";

import type { MediaQuery } from "@/lib/api";

type MediaToolbarProps = {
  tags: string;
  sortBy: MediaQuery["sortBy"];
  sortOrder: MediaQuery["sortOrder"];
  selectedCount: number;
  canDelete: boolean;
  deleting: boolean;
  onTagsChange: (value: string) => void;
  onSortByChange: (value: MediaQuery["sortBy"]) => void;
  onSortOrderChange: (value: MediaQuery["sortOrder"]) => void;
  onBulkDelete: () => void;
};

export default function MediaToolbar({
  tags,
  sortBy,
  sortOrder,
  selectedCount,
  canDelete,
  deleting,
  onTagsChange,
  onSortByChange,
  onSortOrderChange,
  onBulkDelete,
}: MediaToolbarProps) {
  const { token } = theme.useToken();

  return (
    <Card
      style={{
        background: token.colorBgContainer,
        borderColor: token.colorBorderSecondary,
      }}
    >
      <Flex gap={12} justify="space-between" wrap="wrap">
        <Space wrap>
          <Input
            allowClear
            placeholder="Filter by tags"
            style={{ width: 220 }}
            value={tags}
            onChange={(event) => onTagsChange(event.target.value)}
          />

          <Select
            value={sortBy}
            style={{ width: 150 }}
            popupClassName="media-themed-popup"
            dropdownStyle={{
              background: token.colorBgElevated,
              border: `1px solid ${token.colorBorderSecondary}`,
            }}
            onChange={onSortByChange}
            options={[
              { label: "Newest", value: "createdAt" },
              { label: "File name", value: "fileName" },
              { label: "File size", value: "fileSize" },
            ]}
          />

          <Select
            value={sortOrder}
            style={{ width: 120 }}
            popupClassName="media-themed-popup"
            dropdownStyle={{
              background: token.colorBgElevated,
              border: `1px solid ${token.colorBorderSecondary}`,
            }}
            onChange={onSortOrderChange}
            options={[
              { label: "Desc", value: "desc" },
              { label: "Asc", value: "asc" },
            ]}
          />
        </Space>

        <Button
          danger
          className="media-danger-button"
          disabled={!selectedCount || !canDelete}
          icon={<Trash2 />}
          loading={deleting}
          onClick={onBulkDelete}
        >
          Delete selected
        </Button>
      </Flex>
    </Card>
  );
}
