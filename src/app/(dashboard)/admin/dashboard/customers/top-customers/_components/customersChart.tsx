import { Card } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const customers = [
  { customer: "Ayesha", totalSpent: 7200 },
  { customer: "Usman", totalSpent: 4000 },
  { customer: "Bilal", totalSpent: 3000 },
  { customer: "Ahmed", totalSpent: 2800 },
  { customer: "Sara", totalSpent: 2855 },
  { customer: "Naim", totalSpent: 2500 },
  { customer: "Bonna", totalSpent: 1000 },
];

const CustomersChart = () => {
  return (
    <div>
      <Card title="Revenue by Product" style={{ marginTop: 16 }}>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={customers}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="customer" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="totalSpent" fill="var(--dashboard-primary-color)" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default CustomersChart;
