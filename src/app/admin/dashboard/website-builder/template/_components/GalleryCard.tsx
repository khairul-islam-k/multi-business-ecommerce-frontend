import React from 'react';
import { Card, Row, Col, Typography } from "antd";

interface Theme {
    id: number;
    title: string;
    description: string;
    slug: string;
    imageUrl: string;
}

const { Text } = Typography;

const themes: Theme[] = [
    {
        id: 1,
        title: "Modern Minimal",
        description: "Clean and modern layout perfect for fashion brands.",
        slug: "fashion",
        imageUrl: "https://images.unsplash.com/photo-1521334884684-d80222895322",
    },
    {
        id: 2,
        title: "Bold Commerce",
        description: "High-impact design built to boost conversions and sales.",
        slug: "commerce",
        imageUrl: "https://images.unsplash.com/photo-1521334884684-d80222895322",
    },
    {
        id: 3,
        title: "Elegant Lifestyle",
        description: "Sophisticated layout ideal for lifestyle and luxury stores.",
        slug: "lifestyle",
        imageUrl: "https://images.unsplash.com/photo-1521334884684-d80222895322",
    },
    {
        id: 4,
        title: "Elegant Lifestyle",
        description: "Sophisticated layout ideal for lifestyle and luxury stores.",
        slug: "lifestyle",
        imageUrl: "https://images.unsplash.com/photo-1521334884684-d80222895322",
    },
    {
        id: 5,
        title: "Elegant Lifestyle",
        description: "Sophisticated layout ideal for lifestyle and luxury stores.",
        slug: "lifestyle",
        imageUrl: "https://images.unsplash.com/photo-1521334884684-d80222895322",
    },
];

const GalleryCard = () => {
    return (
        <div>
            <Row gutter={[24, 24]}>
                {themes.map((theme) => (
                    <Col key={theme.id} xs={24} sm={12} md={8}>
                        <Card
                            hoverable
                            cover={
                                <img
                                    src={theme.imageUrl}
                                    alt={theme.title}
                                    style={{ height: 200, objectFit: "cover" }}
                                />
                            }
                        >
                            {/* Title + Slug Row */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: 8,
                                }}
                            >
                                <Text strong>{theme.title}</Text>
                                <Text type="secondary">{theme.slug}</Text>
                            </div>

                            <Text type="secondary">{theme.description}</Text>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default GalleryCard;