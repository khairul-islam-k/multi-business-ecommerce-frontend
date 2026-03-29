"use client";
import {
    Card,
    Col,
    Row,
    Space,
    theme
} from 'antd';
import React from 'react';

const BusinessBranding = () => {
    const { token } = theme.useToken();
    return (
        <div>
            <Row gutter={[16, 16]}>

                {/* different Logo */}
                <Col xs={24} md={12}>
                    <Card style={{height: '100%'}}>
                        <h4 style={{fontWeight: 500, fontSize: '20px'}}>Logos & Assets</h4>
                        <p>Upload your brand assets for use across the platform.</p>

                        <section>
                            <h5>Company Logo</h5>
                            <p>Used in sidebar and emails. Recommended: 200×60px PNG.</p>
                            <Space>
                                <div>khairul</div>
                                <div>khairul</div>
                            </Space>
                        </section>
                    </Card>
                </Col>

                {/* color here */}
                <Col xs={24} md={12}>
                    <Card style={{height: '100%'}}>
                        124
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default BusinessBranding;