"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

// Sample weekly sales data
const data = [
    { day: "Mon", sales: 1200 },
    { day: "Tue", sales: 2100 },
    { day: "Wed", sales: 1800 },
    { day: "Thu", sales: 2600 },
    { day: "Fri", sales: 3000 },
    { day: "Sat", sales: 4200 },
    { day: "Sun", sales: 3900 },
];

export default function WeeklyMerchantSalesLineChart() {
    return (
        <div style={{ width: "100%" }}>
            <h3 style={{
                fontSize: '20px',
                fontWeight: 'bold'
            }}>Weekly Merchant Sales</h3>
            <div style={{height: 190}}>
                <ResponsiveContainer>
                    <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip formatter={(value) => `৳${value as number}`} />
                        <Line
                            type="monotone"
                            dataKey="sales"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}