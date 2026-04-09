"use client"
import React, { useRef, useState } from "react"
import { Card, Carousel, Button, Space, Grid } from "antd"
import { LeftOutlined, RightOutlined } from "@ant-design/icons"
import { motion } from "framer-motion"
import Image, { StaticImageData } from "next/image"

import logo_1 from "@/assets/logo/logo-1.jpg"
import logo_2 from "@/assets/logo/logo-2.jpg"
import logo_3 from "@/assets/logo/logo-3.jpg"
import carousel_1 from "@/assets/carousel/carousel-1.jpg"
import carousel_2 from "@/assets/carousel/carousel-2.jpg"
import carousel_3 from "@/assets/carousel/carousel.jpg"
import Link from "next/link"

const { useBreakpoint } = Grid

export interface LogoItem {
    id: number
    logo: string | StaticImageData
    hoverImage: string | StaticImageData
    title: string
}

const logos: LogoItem[] = [
    { id: 1, logo: logo_1, hoverImage: carousel_1, title: "Nike" },
    { id: 2, logo: logo_2, hoverImage: carousel_2, title: "Adidas" },
    { id: 3, logo: logo_3, hoverImage: carousel_3, title: "Puma" },
]

const CustomerComment = () => {
    const carouselRef = useRef<any>(null)
    const [hoveredId, setHoveredId] = useState<number | null>(null)
    const screens = useBreakpoint()

    // 👇 Show 2 on desktop, 1 on mobile
    const slidesToShow = screens.md ? 2 : 1

    return (
        <div style={{ maxWidth: 700 }}>
            {/* Carousel */}
            <Carousel
                ref={carouselRef}
                dots={false}
                slidesToShow={slidesToShow}
            >
                {logos.map((item) => (
                    <div key={item.id} style={{ padding: 16 }}>
                        <Link href={`/review/${item.id}`}>
                            <motion.div
                                onHoverStart={() => setHoveredId(item.id)}
                                onHoverEnd={() => setHoveredId(null)}
                                whileHover={{ scale: 1.05 }}
                            >
                                <Card
                                    hoverable
                                    style={{
                                        width: 260,
                                        height: 200,
                                        margin: "0 auto",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Image
                                        src={
                                            hoveredId === item.id ? item.hoverImage : item.logo
                                        }
                                        alt={item.title}
                                        width={140}
                                        height={140}
                                    />
                                </Card>
                            </motion.div>
                        </Link>
                    </div>
                ))}
            </Carousel>

            {/* Bottom navigation buttons */}
            <Space
                style={{
                    marginTop: 24,
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Button
                    shape="circle"
                    icon={<LeftOutlined />}
                    onClick={() => carouselRef.current?.prev()}
                />
                <Button
                    shape="circle"
                    icon={<RightOutlined />}
                    onClick={() => carouselRef.current?.next()}
                />
            </Space>
        </div>
    )
}

export default CustomerComment