"use client";

import { DeleteOutlined, PictureOutlined } from "@ant-design/icons";
import { Button, Card, Space, Typography } from "antd";
import Image from "next/image";
import { useState } from "react";

import ImageSelectModal from "../../_components/ImageSelectModal";
import { imageUrlSet } from "../../product-catalog/products/_components/image-url";

const { Text } = Typography;

type ImageUploadProps = {
  value?: string;
  onChange?: (imageUrl: string) => void;
};

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card
        size="small"
        styles={{
          body: {
            padding: 12,
          },
        }}
      >
        <Space align="center" className="w-full justify-between">
          <Space align="center">
            {value ? (
              <Image
                src={imageUrlSet(value)}
                alt="Profile image"
                width={48}
                height={48}
                className="rounded-md object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gray-100 text-gray-400">
                <PictureOutlined />
              </div>
            )}

            <div>
              <Text strong>{value ? "Profile image selected" : "No image selected"}</Text>
              <div className="text-xs text-gray-500">
                Use an image from the shared media library.
              </div>
            </div>
          </Space>

          <Space>
            {value ? (
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => onChange?.("")}
              />
            ) : null}

            <Button onClick={() => setOpen(true)}>
              {value ? "Change" : "Select Image"}
            </Button>
          </Space>
        </Space>
      </Card>

      <ImageSelectModal
        open={open}
        selectedUrl={value}
        onClose={() => setOpen(false)}
        onSelect={(url) => onChange?.(url)}
      />
    </>
  );
}
