export interface SmsCampaign {
  id: string;
  tenant_id: string;
  company_id: string | null;
  name: string;
  target_type: string;
  message_body: string;
  scheduled_at: string | null;
  status: string;
  total_recipients: number;
  total_sent: number;
  total_failed: number;
  created_by: string;
}

function r<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rid() {
  return crypto.randomUUID();
}

function rdate(daysBack = 30) {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysBack));
  return d.toISOString();
}

const campaignStatuses = [
  "draft",
  "scheduled",
  "running",
  "completed",
  "failed",
];

export const mockCampaigns: SmsCampaign[] = Array.from(
  { length: 20 },
  (_, i) => {
    const total = 100 + Math.floor(Math.random() * 900);
    const sent = Math.floor(total * (0.7 + Math.random() * 0.3));
    return {
      id: rid(),
      tenant_id: "t1",
      company_id: i % 3 === 0 ? rid() : null,
      name: `Campaign ${i + 1} - ${r(["Spring", "Summer", "Fall", "Winter"])} ${r(["Sale", "Launch", "Promo", "Event"])}`,
      target_type: r(["all_customers", "segment", "manual"]),
      message_body: "Check out our latest deals! Use code SAVE20 for 20% off.",
      scheduled_at: i % 2 === 0 ? rdate(7) : null,
      status: r(campaignStatuses),
      total_recipients: total,
      total_sent: sent,
      total_failed: total - sent,
      created_by: `user_${i % 5}`,
    };
  },
);
