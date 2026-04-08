"use client";
import { Col, Grid, Row, theme } from 'antd';
import Image from 'next/image';
import React from 'react';
import userImage from '@/assets/carousel/carousel-1.jpg';

const CustomersReview = () => {
    const screens = Grid.useBreakpoint();
    const {token} = theme.useToken();

    return (
        <div style={{
            maxWidth: '1200px',
            marginLeft: 'auto',
            marginRight: 'auto',
            paddingTop: screens.xs? '30px': '100px',
            paddingBottom: screens.xs? '30px': '100px',
            paddingLeft: '8px',
            paddingRight: '8px',
            color: token.colorTextBase
        }}>
            <Row>
                <Col xs={24} md={12}>
                <h3 style={{
                    fontSize: '30px',
                    fontWeight: 'bold',
                    margin: 0
                }}>Selim alom sorkar</h3>
                <p style={{
                    fontSize: '20px',
                    marginTop: '5px',
                    marginBottom: 0
                }}>Founder & CEO</p>

                <p style={{
                    marginTop: '10px'
                }}>Company: CarterTech</p>

                    <div>
                        OneComm is a powerful platform built for modern businesses. Tenant and employee accounts are thoughtfully designed, enabling smooth operations, role-based access, and effortless team management.
                    </div>
                </Col>
                <Col xs={24} md={12}>
                    <Image src={userImage} height={400} width={300} alt='person' />
                </Col>
            </Row>
        </div>
    );
};

export default CustomersReview;