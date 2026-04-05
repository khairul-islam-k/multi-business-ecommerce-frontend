"use client";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { Card } from "antd";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import ChargeCard from "./_components/ChargeCard";

const data = [
    {
        zone: "TCS - Karachi",
        inside: 150,
        sub: 200,
        outside: 300,
    },
    {
        zone: "TCS - Lahore",
        inside: 160,
        sub: 220,
        outside: 320,
    },
    {
        zone: "TCS - Islamabad/Rawalpindi",
        inside: 170,
        sub: 230,
        outside: 350,
    },
    {
        zone: "Leopards - Punjab",
        inside: 140,
        sub: 190,
        outside: 280,
    },
    {
        zone: "Leopards - Sindh",
        inside: 150,
        sub: 200,
        outside: 300,
    },
    {
        zone: "PostEx - All",
        inside: 120,
        sub: 180,
        outside: 250,
    },
];


const ChargeSetting = () => {
    return (
        <div>

            <div style={{marginBottom: '24px'}}>
                <PageHeader title='Shipping Charge Settings' breadcrumb={adminBreadcrumb}></PageHeader>
            </div>

            {/* card */}
            <ChargeCard />

            <Card title='Charges Comparison'>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data} barGap={8}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="zone" />
                        <YAxis />
                        <Tooltip formatter={(value) => `Rs ${value}`} />
                        <Legend />

                        <Bar dataKey="inside" name="Inside City" fill="#5B4FDB" />
                        <Bar dataKey="sub" name="Sub City" fill="#3F7AE0" />
                        <Bar dataKey="outside" name="Outside City" fill="#E23B3B" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
};

export default ChargeSetting;