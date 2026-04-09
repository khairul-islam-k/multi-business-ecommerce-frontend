"use client";
import React from 'react';
import user_2 from '@/assets/shipping.jpg';
import products from '@/assets/products.jpg';
import chartImage from '@/assets/analitics.jpg';
import inventory from '@/assets/inventory.jpg';
import { Card, Col, Row } from 'antd';
import Image, { StaticImageData } from 'next/image';
import { motion } from "framer-motion";

type TBusiness = {
    id: number;
    title: string;
    Description: string;
    photo: string | StaticImageData;
};

const businessData: TBusiness[] = [
    {
        id: 1,
        title: 'Shipping Made Simple',
        Description: 'Shipping doesn`t have to be complicated. Connect with top delivery services.',
        photo: user_2,
    },
    {
        id: 2,
        title: 'Inventory & Order Management',
        Description: 'Forget about stock shortages or overselling. Track inventory in real-time, low-stock view.',
        photo: inventory,
    },
    {
        id: 3,
        title: 'Real-Time Analytics & Insights',
        Description: 'Stay ahead of the game with real-time analytics. Monitor sales, customer behavior.',
        photo: chartImage,
    },
    {
        id: 4,
        title: 'Perfect on every screen',
        Description: 'Your store looks stunning on any device desktop, tablet, or mobile. Enjoy a smooth experience.',
        photo: products,
    },
    {
        id: 5,
        title: 'Manage Your Store Anytime',
        Description: 'Easily build, customize, and manage your store. Plus, with our mobile app.',
        photo: user_2,
    },
    {
        id: 6,
        title: 'Customize Your Store',
        Description: 'Choose from beautifully crafted themes and personalize every detail to create a store.',
        photo: user_2,
    },
]

const BusinessSmarter = () => {
    return (
        <div style={{
            marginTop: '40px',
            paddingLeft: '16px',
            paddingRight: '16px'
        }}>
            <h3 style={{
                textAlign: 'center',
                fontSize: '20px',
                fontWeight: 'bold'
            }}>Smart tools that make your business smarter</h3>

            <p style={{ textAlign: 'center' }}>Your Complete Ecommerce Toolkit
                Manage Shipping, Inventory, Orders, and More From One Platform</p>

            <div style={{ maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto', marginTop: '16px' }}>
                <Row gutter={[15, 15]}>
                    {
                        businessData.map(singleData => <Col key={singleData.id} xs={24} md={8}>
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Card>
                                    <Image src={singleData.photo}
                                        style={{
                                            width: '100%',
                                            height: '200px',
                                            objectFit: 'cover',
                                            marginLeft: 'auto',
                                            marginRight: 'auto'
                                        }}
                                        height={200} width={300} alt={singleData.title} />
                                    <h3 style={{
                                        fontSize: '17px',
                                        fontWeight: 'bold',
                                        marginTop: '8px'
                                    }}>{singleData.title}</h3>
                                    <p>{singleData.Description}</p>
                                </Card>
                            </motion.div>
                        </Col>)
                    }
                </Row>
            </div>


        </div>
    );
};

export default BusinessSmarter;