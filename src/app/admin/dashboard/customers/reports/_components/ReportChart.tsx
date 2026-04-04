import { Card } from "antd";
import React from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const reports = [
    { month: "Oct", Website: 50, Facebook: 30, Instagram: 20, "Google Ads": 15, Referral: 10, "Walk-in": 5 },
    { month: "Nov", Website: 55, Facebook: 35, Instagram: 25, "Google Ads": 20, Referral: 12, "Walk-in": 6 },
    { month: "Dec", Website: 70, Facebook: 45, Instagram: 40, "Google Ads": 25, Referral: 15, "Walk-in": 8 },
    { month: "Jan", Website: 65, Facebook: 40, Instagram: 35, "Google Ads": 22, Referral: 14, "Walk-in": 7 },
    { month: "Feb", Website: 68, Facebook: 42, Instagram: 38, "Google Ads": 26, Referral: 16, "Walk-in": 9 },
    { month: "Mar", Website: 75, Facebook: 45, Instagram: 42, "Google Ads": 30, Referral: 18, "Walk-in": 10 },
];

const ReportChart = () => {
    return (
        <Card title={`Acquisition Trends (6 Months)`}>
            <ResponsiveContainer width="100%" height={400}>
                <AreaChart
                    data={reports}
                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorWebsite" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorFacebook" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3572f5" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#3572f5" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorInstagram" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f06292" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#f06292" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorGoogleAds" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f4d03f" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#f4d03f" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorReferral" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#27ae60" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#27ae60" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorWalkIn" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#7f8c8d" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#7f8c8d" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="Website" stackId="1" stroke="#8884d8" fill="url(#colorWebsite)" />
                    <Area type="monotone" dataKey="Facebook" stackId="1" stroke="#3572f5" fill="url(#colorFacebook)" />
                    <Area type="monotone" dataKey="Instagram" stackId="1" stroke="#f06292" fill="url(#colorInstagram)" />
                    <Area type="monotone" dataKey="Google Ads" stackId="1" stroke="#f4d03f" fill="url(#colorGoogleAds)" />
                    <Area type="monotone" dataKey="Referral" stackId="1" stroke="#27ae60" fill="url(#colorReferral)" />
                    <Area type="monotone" dataKey="Walk-in" stackId="1" stroke="#7f8c8d" fill="url(#colorWalkIn)" />
                </AreaChart>
            </ResponsiveContainer>
        </Card>
    );
};

export default ReportChart;