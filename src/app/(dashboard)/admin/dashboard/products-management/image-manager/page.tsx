'use client';
import PageHeader from '@/components/shared/page-header';
import { adminBreadcrumb } from '@/config/breadcrumb.config';
import { DeleteOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Card, Flex, Grid, Input, Select, Space, Tag, theme, Upload } from 'antd';
import React, { useState } from 'react';

const images = [
    "https://i.ibb.co.com/d4SMQNz3/transport-1.png",
    "https://i.ibb.co.com/s9KSvtV5/transport-5.png",
    "https://i.ibb.co.com/Gvhv7SpP/it-5.png",
];

const coffeeImage = [
    "https://i.ibb.co.com/21QtNQd7/3.png",
    "https://i.ibb.co.com/bMdry2Hx/1.png",
    "https://i.ibb.co.com/21QtNQd7/3.png",
];

const electrics = [
    "https://i.ibb.co.com/DPwKWxHm/Bid4-min.png",
    "https://i.ibb.co.com/QjbjCbVB/Bid1-min.png",
    "https://i.ibb.co.com/z3RQH7K/Bid2-min.png",
];

const ImageManager = () => {
    const screens = Grid.useBreakpoint();
    const { Option } = Select;
    const [filterProduct, setFilterProduct] = useState<string>('');
    console.log(filterProduct)

    const handleDelete = (index: number) => {
        console.log("Delete image at index:", index);
    };

    const handleSearch = (data: string) => {
        console.log('search', data);
    }

    const beforeUpload = (file: File) => {
        if (file.size / 1024 / 1024 > 2) {
            return Upload.LIST_IGNORE;
        }
        console.log(file.name);
        return false; //prevent automatic upload

    }

    const { token } = theme.useToken();

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <PageHeader title='Product Image Manager' breadcrumb={adminBreadcrumb}></PageHeader>
            </div>
            <p>Manage product images, set primary photos, and organize sort order.</p>

            {/* Search field */}
            <Flex
                justify="space-between"
                wrap="wrap"
                style={{ marginBottom: '10px' }}
            >
                <Space style={{ marginBottom: 16 }}>
                    <Input
                        style={{
                            width: screens.lg ? "330px" : "100%"
                        }}
                        prefix={<SearchOutlined />}
                        placeholder="Search packages..."
                        onChange={(e) => handleSearch(e.target.value)}
                    />

                    <Select
                        value={filterProduct}
                        style={{ width: 140 }}
                        onChange={setFilterProduct}
                    >
                        <Option value="all">By Rating</Option>
                        <Option value="Starter">By Revenue</Option>
                        <Option value="Growth">By Quality</Option>
                    </Select>
                </Space>

                <div>
                    <Upload style={{ width: '100%' }} accept=".pdf,.jpg,.png"
                        beforeUpload={beforeUpload}
                        showUploadList={false} >
                        <Button
                            type='primary'
                            icon={<UploadOutlined />}>
                            Upload Image
                        </Button>
                    </Upload>

                </div>
            </Flex>

            {/* vehicles */}
            <Card style={{ marginBottom: '20px' }}>

                {/* image header */}
                <Flex justify='space-between' align='center'>
                    <div>
                        <h3 style={{ fontSize: '18px' }}>Classic vehicles</h3>
                        <p>3 image(s) · vehicles</p>
                    </div>

                    <div>
                        <Tag>active</Tag>
                    </div>
                </Flex>

                <div style={{ display: 'flex', gap: '10px', overflow: 'auto' }}>
                    {images.map((src, index) => (
                        <div key={index}>

                            <div
                                style={{
                                    width: 200,
                                    height: 200,
                                    flexShrink: 0,
                                    borderRadius: "10px",
                                    overflow: "hidden",
                                }}>
                                <img
                                    style={{
                                        borderRadius: '10px',
                                        width: '300px',
                                        height: '200px',
                                        objectFit: 'cover',
                                        flexShrink: 0,
                                    }}
                                    src={src} alt={`image-${index}`} />

                            </div>

                            <div style={{
                                marginTop: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}>
                                <DeleteOutlined style={{
                                    fontSize: '20px',
                                    color: token.colorError
                                }} />

                                <h3>#21</h3>
                            </div>

                        </div>
                    ))}
                </div>
            </Card>

            {/* coffee image */}

            <Card style={{ marginBottom: '20px' }}>

                {/* image header */}
                <Flex justify='space-between' align='center'>
                    <div>
                        <h3 style={{ fontSize: '18px' }}>coffee</h3>
                        <p>3 image(s) · coffee</p>
                    </div>

                    <div>
                        <Tag>active</Tag>
                    </div>
                </Flex>

                <div style={{ display: 'flex', gap: '10px', overflow: 'auto' }}>
                    {coffeeImage.map((src, index) => (
                        <div key={index}>

                            <div
                                style={{
                                    width: 200,
                                    height: 200,
                                    flexShrink: 0,
                                    borderRadius: "10px",
                                    overflow: "hidden",
                                }}>
                                <img
                                    style={{
                                        borderRadius: '10px',
                                        width: '300px',
                                        height: '200px',
                                        objectFit: 'cover',
                                        flexShrink: 0,
                                    }}
                                    src={src} alt={`image-${index}`} />

                            </div>

                            <div style={{
                                marginTop: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}>
                                <DeleteOutlined style={{
                                    fontSize: '20px',
                                    color: token.colorError
                                }} />

                                <h3>#21</h3>
                            </div>

                        </div>
                    ))}
                </div>
            </Card>

            {/*  */}
            <Card style={{ marginBottom: '20px' }}>

                {/* image header */}
                <Flex justify='space-between' align='center'>
                    <div>
                        <h3 style={{ fontSize: '18px' }}>electrics</h3>
                        <p>3 image(s) · electrics</p>
                    </div>

                    <div>
                        <Tag>active</Tag>
                    </div>
                </Flex>

                <div style={{ display: 'flex', gap: '10px', overflow: 'auto' }}>
                    {electrics.map((src, index) => (
                        <div key={index}>

                            <div
                                style={{
                                    width: 200,
                                    height: 200,
                                    flexShrink: 0,
                                    borderRadius: "10px",
                                    overflow: "hidden",
                                }}>
                                <img
                                    style={{
                                        borderRadius: '10px',
                                        width: '300px',
                                        height: '200px',
                                        objectFit: 'cover',
                                        flexShrink: 0,
                                    }}
                                    src={src} alt={`image-${index}`} />

                            </div>

                            <div style={{
                                marginTop: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}>
                                <DeleteOutlined style={{
                                    fontSize: '20px',
                                    color: token.colorError
                                }} />

                                <h3>#21</h3>
                            </div>

                        </div>
                    ))}
                </div>
            </Card>



        </div >
    );
};

export default ImageManager;