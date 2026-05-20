"use client";

import { useEffect, useState } from "react";
import { Modal, Card, Row, Col, Button, Empty, Typography } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import { useAuthStore } from "@/stores/auth.store";
import { MediaAsset, useMediaAssets } from "@/lib/api";

const { Text } = Typography;

export type ImageItem = {
    id: string;
    title: string;
    url: string;
};

type ImageSelectModalProps = {
    open: boolean;
    selectedUrl?: string;
    onClose: () => void;
    onSelect: (url: string) => void;
};

const ImageSelectModal = ({
    open,
    selectedUrl,
    onClose,
    onSelect,
}: ImageSelectModalProps) => {
    // const images = [];
    const [currentUrl, setCurrentUrl] = useState<string | undefined>(selectedUrl);
    const business = useAuthStore(s => s.selectedBusiness);
    const {data, isLoading} = useMediaAssets(business?.id);

    const images: MediaAsset[] = data?.items ?? [];

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;

    useEffect(() => {
        if (open) {
            setCurrentUrl(selectedUrl);
        }
    }, [open, selectedUrl]);

    const handleUseSelectedImage = () => {
        if (!currentUrl) return;

        onSelect(currentUrl);
        onClose();
    };

    if (isLoading) return <span>Loading...</span>

    return (
        <Modal
            title="Select Category Image"
            open={open}
            onCancel={onClose}
            width={900}
            centered
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <Button
                    key="select"
                    type="primary"
                    disabled={!currentUrl}
                    onClick={handleUseSelectedImage}
                >
                    Use Selected Image
                </Button>,
            ]}
        >
            {images.length === 0 ? (
                <Empty description="No images found" />
            ) : (
                <Row gutter={[16, 16]}>
                    {images.map((image) => {
                        const isSelected = currentUrl === image.fileUrl;
                        const showUrl = image.fileUrl ?`${baseUrl}${image?.fileUrl}` : '';

                        return (
                            <Col xs={24} sm={12} md={8} key={image.id}>
                                <Card
                                    hoverable
                                    onClick={() => setCurrentUrl(image.fileUrl)}
                                    style={{
                                        border: isSelected
                                            ? "2px solid #1677ff"
                                            : "1px solid #f0f0f0",
                                        position: "relative",
                                        overflow: "hidden",
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
                                            <img
                                                src={showUrl}
                                                alt={image.id}
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",
                                                    display: "block",
                                                }}
                                            />

                                            {isSelected && (
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
                                            )}
                                        </div>
                                    }
                                >
                                    <Text strong>Image media</Text>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            )}
        </Modal>
    );
};

export default ImageSelectModal;