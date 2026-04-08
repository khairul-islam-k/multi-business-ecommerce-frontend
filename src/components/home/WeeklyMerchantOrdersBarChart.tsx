"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

// Sample weekly order data
const data = [
    { day: "Mon", orders: 45 },
    { day: "Tue", orders: 62 },
    { day: "Wed", orders: 58 },
    { day: "Thu", orders: 74 },
    { day: "Fri", orders: 90 },
    { day: "Sat", orders: 120 },
    { day: "Sun", orders: 98 },
];

export default function WeeklyMerchantOrdersBarChart() {
    return (
        <div style={{ width: "100%", height: 250 }}>
            <h3 style={{
                fontSize: '20px',
                fontWeight: 'bold'
            }}>Merchant Orders</h3>
            <h2 style={{
                fontSize: '20px',
                fontWeight: 'bold'
            }}>45,032</h2>
            <ResponsiveContainer>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip
                        formatter={(value) =>
                            typeof value === "number" ? `${value} Orders` : value
                        }
                    />
                    <Bar dataKey="orders" radius={[6, 6, 0, 0]} fill="#1677ff" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}