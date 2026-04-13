import { BookOutlined, CustomerServiceOutlined, SyncOutlined, ToolOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import React from 'react';

const TrustOwner = () => {
    const features = [
        {
            icon: <CustomerServiceOutlined style={{ fontSize: '30px' }} />,
            text: "World-Class Support",
            descriptions: 'We build long-term professional relationships with our customers that you can rely on & trust.'
        },
        {
            icon: <BookOutlined style={{ fontSize: '30px' }} />,
            text: "Documentation & Tutorials",
            descriptions: 'Over 430 help files & 100 tutorial videos will make building websites with OneComn even easier.'
        },
        {
            icon: <ToolOutlined style={{ fontSize: '30px' }} />,
            text: "100% Built In-House",
            descriptions: 'OneComm is not reliant on 3rd party tools to deliver a reliable & stable website building experience.'
        },
        {
            icon: <SyncOutlined style={{ fontSize: '30px' }} />,
            text: "Free Lifetime Updates",
            descriptions: 'Your website will receive free & regular updates, compatible with industry standards & trends, for life.'
        },
    ];

    return (
        <div 
        style={{
            maxWidth: '1200px',
            marginLeft: 'auto',
            marginRight: 'auto',
            textAlign: 'center'
        }}
        >
            <h3 style={{
                fontSize: '40px',
                fontWeight: 'bold',
                marginTop: '60px',
                marginBottom: '60px'

            }}>1,057,913 Website Owners <br /> Trust OneComm</h3>

            <div>

                <Row gutter={[15, 15]}>
                    {
                        features.map(data => <Col key={data.text} xs={24} md={12} lg={6}>
                            <div>
                                <h4>{data.icon}</h4>
                                <h2 style={{
                                    fontSize: '20px',
                                    marginTop: '20px',
                                    marginBottom: '20px'
                                }}>{data.text}</h2>
                                <p>{data.descriptions}</p>
                            </div>
                        </Col>)
                    }
                </Row>

            </div>
        </div>
    );
};

export default TrustOwner;