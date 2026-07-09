import { mockCampaigns } from "../data";

export interface SmsCampaignRecipient {
  id: string;
  sms_campaign_id: string;
  customer_id: string | null;
  phone: string;
  delivery_status: string;
  sent_at: string | null;
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

const deliveryStatuses = ["delivered", "sent", "pending", "failed"];

export const mockRecipients: SmsCampaignRecipient[] = Array.from(
  { length: 50 },
  () => ({
    id: rid(),
    sms_campaign_id: r(mockCampaigns).id,
    customer_id: rid(),
    phone: `+1${Math.floor(2000000000 + Math.random() * 8000000000)}`,
    delivery_status: r(deliveryStatuses),
    sent_at: rdate(7),
  }),
);
