"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

// --------------------
// Data: Online vs COD
// --------------------
const data = [
  { name: "Online Payment", value: 96200 },
  { name: "Cash on Delivery", value: 5200000 },
];

const COLORS = ["#1677ff", "#52c41a"];

// --------------------
// Compute needle position
// --------------------
const total = data.reduce((sum, item) => sum + item.value, 0);
const onlinePercentage = (data[0].value / total) * 100; // Online % of total

// --------------------
// Needle Component
// --------------------
const Needle = ({
  value,
  cx,
  cy,
  radius,
}: {
  value: number; // 0-100%
  cx: number;
  cy: number;
  radius: number;
}) => {
  const angle = 180 * (1 - value / 100); // Needle angle
  const radian = Math.PI / 180;
  const x = cx + radius * Math.cos(-angle * radian);
  const y = cy + radius * Math.sin(-angle * radian);

  return (
    <g>
      <line
        x1={cx}
        y1={cy}
        x2={x}
        y2={y}
        stroke="#000"
        strokeWidth={2}
      />
      <circle cx={cx} cy={cy} r={5} fill="#000" />
    </g>
  );
};

// --------------------
// Main Component
// --------------------
export default function TotalOrderAmountNeedleChart() {
  const cx = 200;
  const cy = 200;
  const radius = 90;

  // Formatter for tooltip
  const formatAmount = (value: number) => {
    if (value >= 1_000_000) return `৳${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `৳${(value / 1_000).toFixed(1)}K`;
    return `৳${value}`;
  };

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <PieChart width={400} height={300}>
          <Pie
            data={data}
            cx={cx}
            cy={cy}
            startAngle={180}
            endAngle={0}
            innerRadius={70}
            outerRadius={100}
            dataKey="value"
            paddingAngle={4}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>

          {/* Needle */}
          <Needle value={onlinePercentage} cx={cx} cy={cy} radius={radius} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend / Labels */}
      <div style={{ display: "flex", justifyContent: "space-around", marginTop: 10 }}>
        {data.map((item, index) => (
          <div key={index} style={{ textAlign: "center" }}>
            <div
              style={{
                width: 12,
                height: 12,
                backgroundColor: COLORS[index],
                borderRadius: "50%",
                display: "inline-block",
                marginRight: 6,
              }}
            />
            <span>{item.name}</span>
            <div style={{ fontWeight: "bold" }}>{formatAmount(item.value)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}