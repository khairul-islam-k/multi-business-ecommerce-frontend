import { Card, Col, Flex, Row, Table } from 'antd';
import React from 'react';

const PurchaseDetail = () => {
    const purchaseOrder = {
        id: 2,
        "PO #": "PO-2026-002",
        Supplier: "BlueWear Ltd",
        Warehouse: "Central Warehouse",
        Date: "2026-03-03",
        Expected: "2026-03-12",
        Total: "Rs 85,500",
        Status: "pending",
        variant: '-',
        Qty: 150,
        product: 'cotton-T-shirt',
        "Unit Cost": "RS 1200",
        createBy: 'admin'
    };

    const dataSource = [purchaseOrder];
    const columns = [
        {
            title: 'Product',
            dataIndex: 'product',
            key: 'product',
        },
        {
            title: 'variant',
            dataIndex: 'variant',
            key: 'variant',
        },
        {
            title: 'QTY',
            dataIndex: 'Qty',
            key: 'Qty',
        },
        {
            title: 'Unit Cost',
            dataIndex: 'Unit Cost',
            key: 'Unit Cost',
        },
        {
            title: 'Total',
            dataIndex: 'Total',
            key: 'Total',
        },
    ]


    return (
        <div>
            <Row gutter={[15, 15]}>
                <Col xs={24} md={15}>
                    <Card title="Line Items"
                        style={{
                            overflowX: 'auto',

                        }}
                    >
                        <Table
                            columns={columns}
                            dataSource={dataSource}
                            rowKey="id"
                            pagination={false}
                            bordered
                        />
                    </Card>
                </Col>

                <Col xs={24} md={9}>
                    {/* card 1 */}
                    <Card title="Order Info"
                        style={{ marginBottom: '15px' }}
                    >
                        <Flex justify='space-between'>
                            <p>Supplier</p>
                            <p>{purchaseOrder.Supplier}</p>
                        </Flex>


                        <Flex justify='space-between'>
                            <p>Warehouse</p>
                            <p>{purchaseOrder.Warehouse}</p>
                        </Flex>

                        <Flex justify='space-between'>
                            <p>Order Date</p>
                            <p>{purchaseOrder.Date}</p>
                        </Flex>

                        <Flex justify='space-between'>
                            <p>Expected</p>
                            <p>{purchaseOrder.Expected}</p>
                        </Flex>

                        <Flex justify='space-between'>
                            <p>Create by</p>
                            <p>{purchaseOrder.createBy}</p>
                        </Flex>

                        <div>
                            <p className='mb-0!'>Note</p>
                            <p>Urgent order for spring collection</p>
                        </div>
                    </Card>

                    {/* summary card */}
                    <Card title="Summary">
                        <Flex justify='space-between'>
                            <p>Subtotal</p>
                            <p>Rs 52,500</p>
                        </Flex>


                        <Flex justify='space-between'>
                            <p>Discount</p>
                            <p>Rs 500</p>
                        </Flex>

                        <Flex justify='space-between'>
                            <p>Tax</p>
                            <p>Rs 52,00</p>
                        </Flex>

                        <Flex justify='space-between'>
                            <p>Shipping</p>
                            <p>Rs 52,00</p>
                        </Flex>

                        <div style={{ borderTop: "1px solid gray" }}>
                            <Flex justify='space-between'>
                                <p>Total</p>
                                <p>Rs 60,000</p>
                            </Flex>
                        </div>


                    </Card>

                </Col>
            </Row>
        </div>
    );
};

export default PurchaseDetail;