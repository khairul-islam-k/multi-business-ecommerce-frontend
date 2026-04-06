"use client";
import PageHeader from '@/components/shared/page-header';
import { adminBreadcrumb } from '@/config/breadcrumb.config';
import { FileTextOutlined, GlobalOutlined, LayoutOutlined, LinkOutlined, RetweetOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Tabs, TabsProps, theme } from 'antd';
import { useParams } from 'next/navigation';
import React from 'react';
import WebsitePage from '../_components/WebsitePage';
import WebsiteMenu from '../_components/WebsiteMenu';
import WebsiteDomain from '../_components/WebsiteDomain';

const WebsiteDetails = () => {
    const { id } = useParams();
    console.log(id);
    const { token } = theme.useToken();


    const detailData = [
        {
            id: 1,
            Icon: FileTextOutlined,
            count: 4,
            title: 'pages'
        },
        {
            id: 2,
            Icon: LayoutOutlined,
            count: 2,
            title: 'Menus'
        },
        {
            id: 3,
            Icon: RetweetOutlined,
            count: 2,
            title: 'Domains'
        },
        {
            id: 4,
            Icon: GlobalOutlined,
            count: 1,
            title: 'Template'
        },
    ]

    const items: TabsProps['items'] = [
        {
            key: 'Pages',
            label: 'Pages',
            children: <WebsitePage />,
        },
        {
            key: 'Menus',
            label: 'Menus',
            children: <WebsiteMenu />,
        },
        {
            key: 'Domains',
            label: 'Domains',
            children: <WebsiteDomain />,
        },
    ];

    return (
        <div>

            <div style={{
                marginBottom: '24px'
            }}>
                <PageHeader title="Main Store" breadcrumb={adminBreadcrumb}></PageHeader>
            </div>

            <div style={{
                marginBottom: '24px',
                textAlign: 'right'
            }}>
                <Button
                    icon={<LinkOutlined />}
                >Visit site</Button>
            </div>

            {/* card */}
            <Row gutter={[15, 15]}>
                {
                    detailData.map(singleData => {
                        const IconComponent = singleData.Icon;
                        return (
                            <Col
                                xs={24} md={6}
                                key={singleData.id}>
                                <Card>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{
                                            background: token.colorBgContainerDisabled,
                                            height: '50px',
                                            width: '50px',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderRadius: '10px'
                                        }}>
                                            <IconComponent style={{ fontSize: '30px' }} />
                                        </div>
                                        <div>
                                            <h3 style={{
                                                fontSize: '20px',
                                                marginBottom: 0!
                                            }}>{singleData.count}</h3>
                                            <p>{singleData.title}</p>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        )
                    })
                }
            </Row>


            {/* Tabs */}
            <Tabs defaultActiveKey="Pages" items={items} />


        </div>
    );
};

export default WebsiteDetails;