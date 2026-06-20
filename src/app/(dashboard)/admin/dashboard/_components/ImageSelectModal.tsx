"use client";

import { useEffect, useState } from "react";
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
} from "antd";
import {
  CheckCircleFilled,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
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

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const [currentUrl, setCurrentUrl] = useState<string | undefined>(selectedUrl);

  const { data, isLoading } = useMediaAssets(businessId);
  const { uploadMedia } = useMediaMutations(businessId);

  const isUploading = uploadMedia.isPending;

  const images: MediaAsset[] = data?.items ?? [];

  useEffect(() => {
    if (open) {
      setCurrentUrl(selectedUrl);
    }
  }, [open, selectedUrl]);

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
                border: "1px dashed #1677ff",
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
                <div className="flex flex-col items-center justify-center gap-3 text-blue-600">
                  <Spin
                    indicator={
                      <LoadingOutlined style={{ fontSize: 34 }} spin />
                    }
                  />

                  <Text strong>Uploading image...</Text>

                  <Text type="secondary" className="text-xs">
                    Please wait
                  </Text>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 text-blue-600">
                  <PlusOutlined style={{ fontSize: 34 }} />

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
                      ? "2px solid #1677ff"
                      : "1px solid #f0f0f0",
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
                        background: "#f5f5f5",
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
                        <CheckCircleFilled
                          style={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            fontSize: 24,
                            color: "#1677ff",
                            background: "#fff",
                            borderRadius: "50%",
                          }}
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
