"use client";

import PageHeader from "@/components/shared/page-header";
import { Card, Typography } from "antd";
import { mockPromotions } from "../data";
import StatusBadge from "../_components/status-badge";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const { Title, Text } = Typography;

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function PromotionCalendar() {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const activePromos = mockPromotions.filter((p) => {
    const start = new Date(p.start_at);
    const end = new Date(p.end_at);
    return (
      start <= new Date(currentYear, currentMonth + 1, 0) &&
      end >= new Date(currentYear, currentMonth, 1)
    );
  });

  const getPromosForDay = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    return activePromos.filter(
      (p) => new Date(p.start_at) <= date && new Date(p.end_at) >= date,
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Promotion Calendar" breadcrumb={adminBreadcrumb} />

      <Card>
        <Title level={4}>
          {months[currentMonth]} {currentYear}
        </Title>

        <div className="grid grid-cols-7 gap-2 mt-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div
              key={d}
              className="text-center text-xs font-medium text-gray-400"
            >
              {d}
            </div>
          ))}

          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={i} />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const promos = getPromosForDay(day);
            const isToday = day === now.getDate();

            return (
              <div
                key={day}
                className="min-h-22.5 border rounded-lg p-2"
                style={
                  isToday
                    ? {
                        backgroundColor:
                          "var(--dashboard-sidebar-active-background-color)",
                        boxShadow:
                          "0 0 0 2px var(--dashboard-focus-ring-color)",
                      }
                    : undefined
                }
              >
                <Text strong>{day}</Text>

                <div className="mt-1 space-y-1">
                  {promos.slice(0, 2).map((p) => (
                    <div
                      key={p.id}
                      className="text-[11px] px-1 rounded truncate"
                      style={{
                        backgroundColor:
                          "var(--dashboard-sidebar-active-background-color)",
                        color: "var(--dashboard-primary-color)",
                      }}
                    >
                      {p.name}
                    </div>
                  ))}
                  {promos.length > 2 && (
                    <Text type="secondary" className="text-[11px]">
                      +{promos.length - 2} more
                    </Text>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card title="Active Promotions This Month">
        <div className="space-y-3">
          {activePromos.slice(0, 5).map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
            >
              <div>
                <Text strong>{p.name}</Text>
                <br />
                <Text type="secondary">
                  {new Date(p.start_at).toLocaleDateString()} —{" "}
                  {new Date(p.end_at).toLocaleDateString()}
                </Text>
              </div>

              <StatusBadge status={p.status} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
