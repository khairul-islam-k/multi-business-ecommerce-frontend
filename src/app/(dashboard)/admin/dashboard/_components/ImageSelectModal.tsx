"use client";

import {
  CircleCheck,
  CirclePlus,
  RefreshCw
} from "lucide-react";


import { useState } from "react";
import {
  App,
  Button,
  Card,
  Col,
  Empty,
  Modal,
  Row,
  Spin,
  Typography,
  Upload,
  theme,
} from "antd";
import { useAuthStore } from "@/stores/auth.store";
import { getApiErrorMessage } from "@/lib/axios";
import { useMediaAssets, useMediaMutations } from "@/lib/api/hooks/media";
import Image from "next/image";

const { Text } = Typography;

type MediaAsset = {
  id: string;
  fileUrl: string;
  fileName?: string | null;
  altText?: string | null;
};

type ImageSelectModalProps = {
  open: boolean;
  selectedUrl?: string;
  onClose: () => void;
  onSelect: (url: string) => void;
};

const imageUrlSet = (url?: string | null) => {
  if (!url) return "";

  if (url.startsWith("http")) {
    return url;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;
  return `${baseUrl}${url}`;
};

const ImageSelectModal = ({
  open,
  selectedUrl,
  onClose,
  onSelect,
}: ImageSelectModalProps) => {
  const { message } = App.useApp();
  const { token } = theme.useToken();

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const [currentUrl, setCurrentUrl] = useState<string | undefined>(selectedUrl);

  const { data, isLoading } = useMediaAssets(businessId);
  const { uploadMedia } = useMediaMutations(businessId);

  const isUploading = uploadMedia.isPending;

  const images: MediaAsset[] = data?.items ?? [];

  const handleUploadImage = async (file: File) => {
    try {
      if (!businessId) {
        message.error("Please select a business first.");
        return;
      }

      const response = await uploadMedia.mutateAsync({
        file,
      });

      const uploadedUrl = response?.fileUrl;

      if (uploadedUrl) {
        setCurrentUrl(uploadedUrl);
      }

      message.success("Image uploaded successfully.");
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
  };

  const handleUseSelectedImage = () => {
    if (!currentUrl) {
      message.error("Please select an image first.");
      return;
    }

    onSelect(currentUrl);
    onClose();
  };

  return (
    <Modal
      title="Select Image"
      open={open}
      afterOpenChange={(isOpen) => {
        if (isOpen) {
          setCurrentUrl(selectedUrl);
        }
      }}
      onCancel={isUploading ? undefined : onClose}
      width={900}
      centered
      maskClosable={!isUploading}
      styles={{
        body: {
          maxHeight: "70vh",
          overflowY: "auto",
          overflowX: "hidden",
        },
      }}
      footer={[
        <Button key="cancel" onClick={onClose} disabled={isUploading}>
          Cancel
        </Button>,

        <Button
          key="select"
          type="primary"
          disabled={!currentUrl || isUploading}
          onClick={handleUseSelectedImage}
        >
          Use Selected Image
        </Button>,
      ]}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Upload
            style={{ width: "100%" }}
            accept="image/*"
            showUploadList={false}
            disabled={isUploading}
            beforeUpload={(file) => {
              void handleUploadImage(file);
              return false;
            }}
          >
            <Card
              hoverable={!isUploading}
              style={{
                height: 230,
                border: `1px dashed ${token.colorPrimary}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: isUploading ? "not-allowed" : "pointer",
                opacity: isUploading ? 0.75 : 1,
              }}
              bodyStyle={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isUploading ? (
                <div
                  className="flex flex-col items-center justify-center gap-3"
                  style={{ color: token.colorPrimary }}
                >
                  <Spin
                    indicator={
                      <RefreshCw className="animate-spin" size={34} />
                    }
                  />

                  <Text strong>Uploading image...</Text>

                  <Text type="secondary" className="text-xs">
                    Please wait
                  </Text>
                </div>
              ) : (
                <div
                  className="flex flex-col items-center justify-center gap-2"
                  style={{ color: token.colorPrimary }}
                >
                  <CirclePlus size={34} />

                  <Text strong>Upload Image</Text>

                  <Text type="secondary" className="text-xs">
                    Click to add new image
                  </Text>
                </div>
              )}
            </Card>
          </Upload>
        </Col>

        {isLoading ? (
          <Col span={24}>
            <div className="py-10 text-center text-gray-500">
              Loading images...
            </div>
          </Col>
        ) : images.length === 0 ? (
          <Col span={24}>
            <Empty description="No images found" />
          </Col>
        ) : (
          images.map((image) => {
            const isSelected = currentUrl === image.fileUrl;
            const previewUrl = imageUrlSet(image.fileUrl);

            return (
              <Col xs={24} sm={12} md={8} key={image.id}>
                <Card
                  hoverable={!isUploading}
                  onClick={() => {
                    if (isUploading) return;

                    setCurrentUrl((prev) =>
                      prev === image.fileUrl ? undefined : image.fileUrl,
                    );
                  }}
                  style={{
                    border: isSelected
                      ? `2px solid ${token.colorPrimary}`
                      : `1px solid ${token.colorBorderSecondary}`,
                    position: "relative",
                    overflow: "hidden",
                    cursor: isUploading ? "not-allowed" : "pointer",
                  }}
                  cover={
                    <div
                      style={{
                        height: 160,
                        position: "relative",
                        overflow: "hidden",
                        background: token.colorFillTertiary,
                      }}
                    >
                      <Image
                        src={previewUrl}
                        alt={image.altText || image.fileName || "Media image"}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                        width={200}
                        height={200}
                        unoptimized
                      />

                      {isSelected ? (
                        <CircleCheck
                          style={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            color: token.colorPrimary,
                            background: token.colorBgContainer,
                            borderRadius: "50%",
                          }}
                          size={24}
                        />
                      ) : null}
                    </div>
                  }
                >
                  <Text
                    strong
                    style={{
                      display: "block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {image.fileName || "Image media"}
                  </Text>
                </Card>
              </Col>
            );
          })
        )}
      </Row>
    </Modal>
  );
};

export default ImageSelectModal;
