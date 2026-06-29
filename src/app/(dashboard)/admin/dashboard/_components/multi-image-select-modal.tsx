"use client";

import {
  CircleCheck,
  CirclePlus,
  RefreshCw,
  Trash2
} from "lucide-react";


import { Dispatch, SetStateAction, useState } from "react";
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
import { ProductImage } from "../product-catalog/products/_components/product-form";

const { Text } = Typography;

type MediaAsset = {
  id: string;
  fileUrl: string;
  fileName?: string | null;
  altText?: string | null;
};

type ImageSelectModalProps = {
  open: boolean;
  selectedUrl?: ProductImage[];
  onClose: () => void;
  onSelect: Dispatch<SetStateAction<ProductImage[]>>;
};

const imageUrlSet = (url?: string | null) => {
  if (!url) return "";

  if (url.startsWith("http")) {
    return url;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;
  return `${baseUrl}${url}`;
};

const MultiImageSelectModal = ({
  open,
  selectedUrl,
  onClose,
  onSelect,
}: ImageSelectModalProps) => {
  const { message } = App.useApp();
  const { token } = theme.useToken();

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const [currentUrl, setCurrentUrl] = useState<ProductImage[]>([]);

  const { data, isLoading } = useMediaAssets(businessId);
  const { uploadMedia, uploadMediaBulk } = useMediaMutations(businessId);

  const [imageFiles, setImageFiles] = useState<File[]>([]);


  const isUploading = uploadMedia.isPending;

  const images: MediaAsset[] = data?.items ?? [];

  const handleUploadImage = async (file: File) => {

    setImageFiles((prev) => {
      const alreadyExists = prev.some(
        (item) =>
          item.name === file.name &&
          item.size === file.size &&
          item.lastModified === file.lastModified
      );

      if (alreadyExists) {
        return prev;
      }

      return [...prev, file];
    });
  };

  const handleImageBulkUpload = async () => {
    if (!imageFiles.length) {
      message.error("Please select at least one image.");
      return;
    }

    try {
      const res = await uploadMediaBulk.mutateAsync({
        files: imageFiles,
      });

      const uploadedImages: ProductImage[] = res.map((item, index) => ({
        imageUrl: item.fileUrl,
        altText: item.altText || item.fileName || "Product image",
        isThumbnail: false,
      }));

      setCurrentUrl((prev) => [...prev, ...uploadedImages]);

      setImageFiles([]);

      message.success("Images uploaded successfully.");
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
      title={
        <div className="flex items-center justify-between gap-2 pt-8">
          <h3 className="m-0">Select Images</h3>

          <Button
            type="primary"
            onClick={handleImageBulkUpload}
            disabled={!imageFiles.length || isUploading}
            loading={isUploading}
          >
            Upload
          </Button>
        </div>
      }
      open={open}
      afterOpenChange={(isOpen) => {
        if (isOpen) {
          setCurrentUrl(selectedUrl ?? []);
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
          disabled={currentUrl.length === 0 || isUploading}
          onClick={handleUseSelectedImage}
        >
          Use Selected Image
        </Button>,
      ]}
    >
      <Row gutter={[16, 16]}>
        {/* Upload image full width */}
        <Col span={24}>
          <div className="w-full [&_.ant-upload]:w-full [&_.ant-upload-select]:w-full">
            <Upload
              accept="image/*"
              multiple
              showUploadList={false}
              disabled={isUploading}
              beforeUpload={(file) => {
                setImageFiles((prev) => {
                  const exists = prev.some((item) => item.name === file.name);

                  if (exists) return prev;

                  return [...prev, file as File];
                });

                // Do not upload here if you already use upload button
                // void handleUploadImage(file);

                return false;
              }}
            >
              <Card
                hoverable={!isUploading}
                style={{
                  height: 150,
                  width: "100%",
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
                      indicator={<RefreshCw className="animate-spin" size={34} />}
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
          </div>

          {imageFiles.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <Text strong>Selected Images:  {imageFiles.length}</Text>

              <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
                {imageFiles.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between rounded-md border border-gray-200 px-3 py-2"
                  >
                    <Text
                      type="secondary"
                      style={{
                        maxWidth: 210,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {index + 1}. {file.name}
                    </Text>

                    <Trash2
                      onClick={() => {
                        setImageFiles((prev) =>
                          prev.filter((_, fileIndex) => fileIndex !== index),
                        );
                      }}
                      style={{
                        color: token.colorError,
                        cursor: "pointer",
                      }}
                      size={16}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
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
            const isSelected = currentUrl.some(
              (item) => item.imageUrl === image.fileUrl,
            );

            const previewUrl = imageUrlSet(image.fileUrl);

            return (
              <Col xs={24} sm={12} md={8} key={image.id}>
                <Card
                  hoverable={!isUploading}
                  onClick={() => {
                    if (isUploading) return;

                    setCurrentUrl((prev) => {
                      const alreadySelected = prev.some(
                        (item) => item.imageUrl === image.fileUrl,
                      );

                      if (alreadySelected) {
                        return prev.filter(
                          (item) => item.imageUrl !== image.fileUrl,
                        );
                      }

                      return [
                        ...prev,
                        {
                          imageUrl: image.fileUrl,
                          altText:
                            image.altText || image.fileName || "Product image",
                          isThumbnail: false,
                        },
                      ];
                    });
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

                      {isSelected && (
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
                      )}
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

export default MultiImageSelectModal;
