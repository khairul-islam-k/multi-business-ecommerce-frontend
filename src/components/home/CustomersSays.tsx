'use client';
import React from 'react';
import CustomerComment from './CustomerComment';
import { Col, Flex, Grid, Row, theme } from 'antd';

const CustomersSays = () => {
    const { token } = theme.useToken();
    const screens = Grid.useBreakpoint();

    return (
        <div style={{
            background: token.colorBgContainerDisabled,
            color: token.colorTextBase,
            paddingTop: screens.xs ? '40px' : '100px',
            paddingBottom: screens.xs ? '40px' : '100px',

        }}>

            <Row>
                <Col xs={24} md={12}>
                    <CustomerComment />
                </Col>

                <Col xs={24} md={12}>
                    <div style={{
                        paddingTop: screens.xs ? '40px' : '100px',
                        paddingBottom: screens.xs ? '40px' : '100px',
                        paddingLeft: '10px',
                        paddingRight: '10px'
                    }}>
                        <h3 style={{
                            fontSize: '30px',
                            fontWeight: 'bold'
                        }}>What Our <br /> Customers Say</h3>
                        <p>Our commitment to quality and innovation <br /> is reflected in the voices of our customers. Discover why they <br /> choose us again and again.</p>
                    </div>
                </Col>
            </Row>

        </div>
    );
};

export default CustomersSays;