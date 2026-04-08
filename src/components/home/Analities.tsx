"use client";
import { Avatar, Card, Col, Flex, Row, Tooltip } from 'antd';
import { PieChart, Pie, Sector, ResponsiveContainer } from "recharts";
import { useState } from "react";
import WeeklyMerchantSalesTinyChart from './WeeklyMerchantSalesTinyChart';
import WeeklyMerchantOrdersBarChart from './WeeklyMerchantOrdersBarChart';
import { AntDesignOutlined, UserOutlined } from '@ant-design/icons';
import TotalOrderAmountChart from './TotalOrderAmountChart';

const data = [
    { name: "Online Payment", value: 96200 },
    { name: "Cash on Delivery", value: 5200000 },
];

const TypedPie = Pie as any;

// ✅ super simple active shape
const ActiveShape = ({ cx, cy, innerRadius, outerRadius, startAngle, endAngle, value, payload }: any) => (
    <g>
        <text x={cx} y={cy - 8} textAnchor="middle">
            {payload.name}
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontWeight="bold">
            ৳{value >= 1_000_000 ? `${(value / 1_000_000).toFixed(1)}M` : `${(value / 1_000).toFixed(1)}K`}
        </text>

        <Sector
            cx={cx}
            cy={cy}
            innerRadius={innerRadius}
            outerRadius={outerRadius + 6}
            startAngle={startAngle}
            endAngle={endAngle}
        />
    </g>
);

const Analities = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div style={{
            marginTop: '20px',
            maxWidth: '1200px',
            marginLeft: 'auto',
            marginRight: 'auto'
        }}>
            <Row gutter={[15, 15]}>
                <Col xs={24} md={8}>
                    <Card>
                        <h3 style={{
                            fontSize: '20px',
                            fontWeight: 'bold'
                        }}>Today`s Merchant Sell</h3>

                        <div style={{height: 190}}>
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <TypedPie
                                        data={data}
                                        dataKey="value"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={90}
                                        activeIndex={activeIndex}
                                        activeShape={ActiveShape}
                                        onMouseEnter={(_: any, i: number) => setActiveIndex(i)}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <Flex justify='space-between'>
                            <p>Online Payment</p>
                            <p>৳27.5K</p>
                        </Flex>

                        <Flex justify='space-between'>
                            <p>Online Payment</p>
                            <p>৳27.5K</p>
                        </Flex>

                        <WeeklyMerchantSalesTinyChart />
                    </Card>
                </Col>

                <Col xs={24} md={8}>
                    <div style={{
                        marginBottom: '20px',
                    }}>
                        <Card style={{ height: '400px' }}>
                            <WeeklyMerchantOrdersBarChart />
                        </Card>
                    </div>

                    {/* customers */}
                    <Card>

                        <Avatar.Group>
                            <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
                            <a href="https://ant.design">
                                <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                            </a>
                            <Tooltip title="Ant User" placement="top">
                                <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                            </Tooltip>
                            <Avatar style={{ backgroundColor: '#1677ff' }} icon={<AntDesignOutlined />} />
                        </Avatar.Group>

                        <Flex style={{ gap: '24px' }}>
                            <div>
                                <h3 style={{
                                    fontSize: '20px',
                                    fontWeight: 'bold'
                                }}>100K+</h3>
                                <p>Shops created</p>
                            </div>

                            <div>
                                <h3 style={{
                                    fontSize: '20px',
                                    fontWeight: 'bold'
                                }}>200K+</h3>
                                <p>Shops created</p>
                            </div>
                        </Flex>
                    </Card>
                </Col>

                <Col xs={24} md={8}>
                    <Card style={{ height: '400px' }}>
                        <TotalOrderAmountChart />
                    </Card>

                    {/* all shops */}
                    <Card style={{
                        marginTop: '20px',
                        height: 165
                    }}>
                        <Flex style={{ gap: '24px' }}>
                            <div>
                                <h3 style={{
                                    fontSize: '20px',
                                    fontWeight: 'bold'
                                }}>1250</h3>
                                <p>New Shop</p>
                            </div>

                            <div>
                                <h3 style={{
                                    fontSize: '20px',
                                    fontWeight: 'bold'
                                }}>4500</h3>
                                <p>Active Shop</p>
                            </div>
                        </Flex>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Analities;