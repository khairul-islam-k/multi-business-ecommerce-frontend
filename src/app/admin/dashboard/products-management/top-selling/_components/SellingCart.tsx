import { Card } from 'antd';
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const sellProducts = [
    { product: "Smart Watch Pro", sell: 7200 },
    { product: "Wireless Blueto", sell: 4000 },
    { product: "Classic White S…", sell: 3000 },
    { product: "Organic Cotton …", sell: 2800 },
    { product: "Running Shorts", sell: 2855 },
    { product: "Shows", sell: 2500 },
    { product: "mouse", sell: 1000 },
]


const SellingCart = () => {
    return (
        <div>
            <Card title="Revenue by Product" style={{ marginTop: 16 }}>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={sellProducts}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="product" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="sell" fill="#1677ff" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
};

export default SellingCart;