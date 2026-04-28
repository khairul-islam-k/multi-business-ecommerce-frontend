import { EnvironmentOutlined, SearchOutlined } from '@ant-design/icons';
import { Card, Flex, Grid, Input, Select, Space, Table, Tag } from 'antd';
import React from 'react';

const { Option } = Select;

const AddressTabla = () => {
    const screens = Grid.useBreakpoint()

    const handleSearch = (data: string) => {
        console.log('search', data);
    }

    const data = [
        {
            id: 1,
            Customer: "Ahmed Khan",
            Label: "Home",
            Address: "House 12, Street 5, F-8, Islamabad",
            City: "Islamabad",
            "Postal Code": "44000",
            Default: "Default",
        },
        {
            id: 2,
            Customer: "Sara Ali",
            Label: "Office",
            Address: "Suite 210, Tower B, Blue Area, Islamabad",
            City: "Islamabad",
            "Postal Code": "44000",
            Default: "",
        },
        {
            id: 3,
            Customer: "Usman Riaz",
            Label: "Home",
            Address: "House 45, Street 12, G-10, Islamabad",
            City: "Islamabad",
            "Postal Code": "44020",
            Default: "",
        },
        {
            id: 4,
            Customer: "Fatima Noor",
            Label: "Work",
            Address: "Floor 3, Business Plaza, F-6, Islamabad",
            City: "Islamabad",
            "Postal Code": "44010",
            Default: "",
        },
        {
            id: 5,
            Customer: "Ali Hassan",
            Label: "Home",
            Address: "House 9, Street 7, I-8, Islamabad",
            City: "Islamabad",
            "Postal Code": "44030",
            Default: "",
        },
    ];

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Customer",
            dataIndex: "Customer",
            key: "Customer",
        },
        {
            title: "Label",
            dataIndex: "Label",
            key: "Label",
            render: (text: string) => (
                <Tag color={text === "Home" ? "green" : text === "Office" ? "blue" : "orange"}>
                    {text}
                </Tag>
            ),
        },
        {
            title: "Address",
            dataIndex: "Address",
            key: "Address",
        },
        {
            title: "City",
            dataIndex: "City",
            key: "City",
        },
        {
            title: "Postal Code",
            dataIndex: "Postal Code",
            key: "Postal Code",
        },
        {
            title: "Default",
            dataIndex: "Default",
            key: "Default",
            render: (text: string) => text && <Tag color="red">{text}</Tag>,
        },
    ];

    return (
        <div>
            <Card>
                {/* Search and filter */}
                <Flex
                    justify="space-between"
                    wrap="wrap"
                    style={{ marginBottom: '10px' }}
                >

                    <div>
                        <h3 style={{
                            fontSize: '20px',
                            fontWeight: 'bold'
                        }}><EnvironmentOutlined /> Addresses</h3>
                    </div>

                    <Space style={{ marginBottom: 16 }}>
                        <Input
                            style={{
                                width: screens.lg ? "330px" : "100%"
                            }}
                            prefix={<SearchOutlined />}
                            placeholder="Search packages..."
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </Space>
                </Flex>
                
                <div style={{overflow: 'auto'}}>
                    <Table columns={columns} dataSource={data} rowKey="id" />
                </div>
            </Card>
        </div>
    );
};

export default AddressTabla;