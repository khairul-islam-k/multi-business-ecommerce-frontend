'use client';
import React from "react";
import { Card, Table } from "antd";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const courierRates = [
    {
        id: 1,
        Courier: "TCS Express",
        Zone: "Karachi Metro",
        "Inside City": "Rs 150",
        "Sub City": "Rs 200",
        "Outside City": "Rs 300",
        "COD Charge": "Rs 30",
    },
    {
        id: 2,
        Courier: "TCS Express",
        Zone: "Lahore Metro",
        "Inside City": "Rs 140",
        "Sub City": "Rs 190",
        "Outside City": "Rs 280",
        "COD Charge": "Rs 30",
    },
    {
        id: 3,
        Courier: "Leopards Courier",
        Zone: "Karachi Metro",
        "Inside City": "Rs 145",
        "Sub City": "Rs 195",
        "Outside City": "Rs 290",
        "COD Charge": "Rs 25",
    },
    {
        id: 4,
        Courier: "Leopards Courier",
        Zone: "Punjab Zone",
        "Inside City": "Rs 160",
        "Sub City": "Rs 210",
        "Outside City": "Rs 320",
        "COD Charge": "Rs 35",
    },
    {
        id: 5,
        Courier: "DHL Express",
        Zone: "International Zone A",
        "Inside City": "Rs 500",
        "Sub City": "Rs 650",
        "Outside City": "Rs 900",
        "COD Charge": "Rs 0",
    },
];


const DeliveryZones = () => {
    const columns = [
        {
            title: "Courier",
            dataIndex: "Courier",
            key: "courier",
        },
        {
            title: "Zone",
            dataIndex: "Zone",
            key: "zone",
        },
        {
            title: "Inside City",
            dataIndex: "Inside City",
            key: "insideCity",
        },
        {
            title: "Sub City",
            dataIndex: "Sub City",
            key: "subCity",
        },
        {
            title: "Outside City",
            dataIndex: "Outside City",
            key: "outsideCity",
        },
        {
            title: "COD Charge",
            dataIndex: "COD Charge",
            key: "codCharge",
        },
    ];


    return (
        <div>

            <div style={{marginBottom: '24px'}}>
                <PageHeader title='Delivery Zones' breadcrumb={adminBreadcrumb}></PageHeader>
            </div>

            <Card title="Zone Settings">
                <div style={{
                    overflowX: 'auto',
                    overflowY: 'hidden'
                }}>
                    <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={courierRates}
                        bordered
                        pagination={false}
                    />
                </div>
            </Card>
        </div>
    );
};

export default DeliveryZones;