"use client";

import { CopyOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Empty,
  Flex,
  Image,
  Tag,
  Typography,
  theme,
} from "antd";

import type { MediaAsset } from "@/lib/api";
import {
  fileName,
  formatFileSize,
  mediaUrl,
} from "../_utils/media";

const { Text, Title } = Typography;

type MediaCardProps = {
  asset: MediaAsset;
  selected: boolean;
  canDelete: boolean;
  deleting: boolean;
  onCopy: (url: string) => void;
  onDelete: (asset: MediaAsset) => void;
  onSelectionChange: (assetId: string, checked: boolean) => void;
};

export default function MediaCard({
  asset,
  selected,
  canDelete,
  deleting,
  onCopy,
  onDelete,
  onSelectionChange,
}: MediaCardProps) {
  const { token } = theme.useToken();
  const src = mediaUrl(asset);

  return (
    <Card
      hoverable
      styles={{ body: { padding: 14 } }}
      style={{
        background: token.colorBgContainer,
        borderColor: selected ? token.colorPrimary : token.colorBorderSecondary,
        boxShadow: selected ? `0 0 0 1px ${token.colorPrimary}` : undefined,
      }}
      cover={
        <div
          className="relative flex aspect-[4/3] items-center justify-center overflow-hidden"
          style={{ background: token.colorFillTertiary }}
        >
          <Checkbox
            checked={selected}
            className="absolute left-3 top-3 z-10"
            disabled={!canDelete}
            onChange={(event) =>
              onSelectionChange(asset.id, event.target.checked)
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
          <Title level={5} ellipsis={{ rows: 1 }} style={{ margin: 0 }}>
            {fileName(asset)}
          </Title>
          <Text type="secondary">{formatFileSize(asset.fileSize)}</Text>
        </div>

        {asset.altText && (
          <Text type="secondary" className="block" ellipsis>
            {asset.altText}
          </Text>
        )}

        <Flex gap={6} wrap="wrap">
          {asset.tags?.length ? (
            asset.tags.map((tag) => <Tag key={tag.id}>{tag.name}</Tag>)
          ) : (
            <Tag>untagged</Tag>
          )}
        </Flex>

        <Flex gap={8} justify="space-between">
          <Button icon={<CopyOutlined />} onClick={() => onCopy(src)}>
            Copy URL
          </Button>

          <Button
            danger
            icon={<DeleteOutlined />}
            loading={deleting}
            disabled={!canDelete}
            onClick={() => onDelete(asset)}
          />
        </Flex>
      </div>
    </Card>
  );
}
