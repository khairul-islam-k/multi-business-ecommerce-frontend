"use client";
import PageHeader from '@/components/shared/page-header';
import { adminBreadcrumb } from '@/config/breadcrumb.config';
import { DownloadOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Col, Row, Select, theme } from 'antd';
import React, { useState } from 'react';
import ExportTable from './_components/ExportTable';

const { Option } = Select;

const productFields = [
    "Product Name",
    "SKU",
    "Category",
    "Status",
    "Sale Price",
    "Cost Price",
    "Barcode",
    "Variant Name",
    "Stock Alert Qty",
    "Tags",
    "Image URLs",
    "Created Date",
];

const BulkExport = () => {
    const { token } = theme.useToken()
    const [checkedValues, setCheckedValues] = useState<string[]>([]);
    console.log('check', checkedValues)

    // 
    const [fileFormat, setFileFormat] = useState<string>('CSV(.csv)');
    const [filterProduct, setFilterProduct] = useState<string>('All Products');
    console.log(fileFormat);

    const onChange = (values: Array<string>) => {
        console.log("Checked values:", values);
        setCheckedValues(values);
    };

    return (
        <div>
            <div style={{ marginBottom: "24px" }}>
                <PageHeader title='Product Bulk Export' breadcrumb={adminBreadcrumb}></PageHeader>
                <p>Export product data in CSV or Excel format with customizable fields.</p>
            </div>

            <Row gutter={[15, 15]}>

                <Col xs={24} md={15}>
                    <Card>
                        <h3 style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            margin: 0
                        }}>Select Fields to Export</h3>
                        <p>Choose which data columns to include in your export</p>

                        {/* check box */}
                        <Checkbox.Group
                            value={checkedValues}
                            onChange={onChange}
                            style={{ width: "100%" }}>
                            <Row gutter={[16, 16]}>
                                {productFields.map((field) => (
                                    <Col span={8} key={field}>
                                        {/* <div style={{border: `1px solid ${token.colorBorder}`}}> */}
                                        <Checkbox
                                            style={{
                                                border: `1px solid ${token.colorBorder}`,
                                                width: '100%',
                                                padding: '8px',
                                                borderRadius: '8px'
                                            }}
                                            value={field}>{field}</Checkbox>
                                    </Col>
                                ))}
                            </Row>
                        </Checkbox.Group>
                    </Card>
                </Col>

                <Col xs={24} md={9}>
                    <Card>
                        <h3 style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            margin: 0
                        }}>Export Settings</h3>

                        <h3 style={{marginTop: '10px'}}>Format</h3>
                        <Select
                            value={fileFormat}
                            style={{
                                width:'100%'
                            }}
                            onChange={setFileFormat}
                        >
                            <Option value="CSV(.csv)">CSV(.csv)</Option>
                            <Option value="Excel(.xlsx)">Excel(.xlsx)</Option>
                            <Option value="JSON(.json)">JSON(.json)</Option>
                        </Select>

                        {/* Product Status */}

                        <h3 style={{marginTop: '15px'}}>Product Status</h3>
                        <Select
                            value={filterProduct}
                            style={{
                                width:'100%'
                            }}
                            onChange={setFilterProduct}
                        >
                            <Option value="All Products">All Products</Option>
                            <Option value="Active only">Active only</Option>
                            <Option value="Draft only">Draft only</Option>
                            <Option value="Archive only">Archive only</Option>
                        </Select>

                        <div 
                        style={{
                            borderTop: `1px solid ${token.colorBorder}`,
                            marginTop: '15px',
                            paddingTop: "10px"
                        }}
                        >
                            <p>1 products · 3 fields</p>
                        </div>

                        <Button
                        style={{marginTop: '10px'}}
                        block
                        icon={<DownloadOutlined />}
                        type='primary'>Export Json</Button>


                    </Card>
                </Col>

            </Row>

            {/* Table */}
            <ExportTable />

        </div>
    );
};

export default BulkExport;