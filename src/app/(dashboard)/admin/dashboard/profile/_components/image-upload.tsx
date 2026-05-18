"use client";

import type { UploadProps } from "antd";
import { Button, Upload, message } from "antd";

import api, { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import { useMediaMutations } from "@/lib/api";

type ImageUploadProps = {
  value?: string;
  onChange?: (imageUrl: string) => void;
};


export default function ImageUpload({ onChange }: ImageUploadProps) {
  const businessId = useAuthStore((s) => s.selectedBusiness?.id);
  const {uploadMedia} = useMediaMutations(businessId);

  const uploadProps: UploadProps = {
    accept: "image/*",
    maxCount: 1,
    showUploadList: true,

    beforeUpload: async (file) => {
      try {
        if (!businessId) {
          message.error("Business ID not found");
          return Upload.LIST_IGNORE;
        }

        if (!file.type.startsWith("image/")) {
          message.error("Only image files are allowed");
          return Upload.LIST_IGNORE;
        }

        const response = await uploadMedia.mutateAsync({file});

        const imageUrl = response?.fileUrl;

        if (!imageUrl) {
          throw new Error("Image URL not found");
        }

        onChange?.(imageUrl);
        message.success("Image uploaded successfully");
      } catch (error) {
        message.error(getApiErrorMessage(error));
        onChange?.("");
      }

      return false;
    },

    onRemove: () => {
      onChange?.("");
      return true;
    },
  };

  return (
    <Upload {...uploadProps} style={{ width: "100%" }} >
      <Button className="w-full">Upload Image</Button>
    </Upload>
  );
}