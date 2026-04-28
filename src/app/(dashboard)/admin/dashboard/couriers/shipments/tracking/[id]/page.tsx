"use client";
import PageHeader from '@/components/shared/page-header';
import { adminBreadcrumb } from '@/config/breadcrumb.config';
import { BookOutlined } from '@ant-design/icons';
import { Card, Col, Flex, Row, theme } from 'antd';
import React from 'react';

const ShipmentTracking = () => {
    const { token } = theme.useToken();
    const trackShipment = {
        id: 1,
        Tracking: "TCS-78901234",
        Order: "ORD-2026-101",
        Courier: "TCS Express",
        Customer: "Ahmed Khan",
        City: "Islamabad",
        Shipped: "3/25/2026",
        Status: "Delivered",
        Delivered: "3/28/2026, 8:30:00 PM"
    };

    return (
        <div>

            <div style={{marginBottom: '24px'}}>
                <PageHeader title={trackShipment.Tracking} breadcrumb={adminBreadcrumb}></PageHeader>
            </div>

            <Row gutter={[15, 15]}>
                <Col xs={24} md={12}>
                    <Card
                    style={{height: '100%'}}
                    title="Shipment Info">
                        <Flex justify='space-between'>
                            <p>Customer</p>
                            <p>{trackShipment.Customer}</p>
                        </Flex>

                        <Flex justify='space-between'>
                            <p>City</p>
                            <p>{trackShipment.City}</p>
                        </Flex>

                        <Flex justify='space-between'>
                            <p>Courier</p>
                            <p>{trackShipment.Courier}</p>
                        </Flex>

                        <Flex justify='space-between'>
                            <p>Status</p>
                            <p style={{
                                background: token.colorPrimary,
                                color: token.colorWhite,
                                paddingLeft: '8px',
                                paddingRight: '8px',
                                borderRadius: '8px'
                            }}>{trackShipment.Status}</p>
                        </Flex>

                        <Flex justify='space-between'>
                            <p>Shipped</p>
                            <p>{trackShipment.Shipped}</p>
                        </Flex>

                        <Flex justify='space-between'>
                            <p>Delivered</p>
                            <p>{trackShipment.Delivered}</p>
                        </Flex>


                    </Card>
                </Col>

                <Col xs={24} md={12}>
                    <Card
                    style={{
                        height: '100%'
                    }}
                    title="Tracking Timeline">

                        {/* book */}
                        <Flex style={{
                            marginBottom: '10px'
                        }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                background: token.colorBgContainerDisabled,
                                display: 'flex',
                                justifyContent: 'center',
                                borderRadius: '100%'
                            }}><BookOutlined /></div>
                            <div>
                                <h3 style={{
                                    marginBottom: 0!,
                                    fontSize: '16px',

                                }}>booked</h3>
                                <p>3/25/2026, 4:00:00 PM</p>
                            </div>
                        </Flex>

                        {/* picked up */}
                        <Flex style={{
                            marginBottom: '10px'
                        }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                background: token.colorBgContainerDisabled,
                                display: 'flex',
                                justifyContent: 'center',
                                borderRadius: '100%'
                            }}><BookOutlined /></div>
                            <div>
                                <h3 style={{
                                    marginBottom: 0!,
                                    fontSize: '16px',

                                }}>picked up</h3>
                                <p>3/25/2026, 8:00:00 PM</p>
                            </div>
                        </Flex>

                        {/* in transit */}
                        <Flex style={{
                            marginBottom: '10px'
                        }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                background: token.colorBgContainerDisabled,
                                display: 'flex',
                                justifyContent: 'center',
                                borderRadius: '100%'
                            }}><BookOutlined /></div>
                            <div>
                                <h3 style={{
                                    marginBottom: 0!,
                                    fontSize: '16px',

                                }}>
                                    in transit</h3>
                                <p>3/26/2026, 2:00:00 PM</p>
                            </div>
                        </Flex>

                        {/* out for delivery */}
                        <Flex style={{
                            marginBottom: '10px'
                        }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                background: token.colorBgContainerDisabled,
                                display: 'flex',
                                justifyContent: 'center',
                                borderRadius: '100%'
                            }}><BookOutlined /></div>
                            <div>
                                <h3 style={{
                                    marginBottom: 0!,
                                    fontSize: '16px',

                                }}>
                                    out for delivery</h3>
                                <p>3/28/2026, 3:00:00 PM</p>
                            </div>
                        </Flex>

                        {/* delivered */}
                        <Flex style={{
                            marginBottom: '10px'
                        }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                background: token.colorBgContainerDisabled,
                                display: 'flex',
                                justifyContent: 'center',
                                borderRadius: '100%'
                            }}><BookOutlined /></div>
                            <div>
                                <h3 style={{
                                    marginBottom: 0!,
                                    fontSize: '16px',

                                }}>
                                    delivered</h3>
                                <p>3/28/2026, 8:30:00 PM</p>
                            </div>
                        </Flex>


                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ShipmentTracking;