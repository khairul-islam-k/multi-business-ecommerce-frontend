import { mockCampaigns } from "../../campaigns/data";

export interface SmsCreditTransaction {
  id: string;
  tenant_id: string;
  transaction_type: string;
  credits: number;
  amount: number | null;
  note: string;
  created_at: string;
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

export const mockTransactions: SmsCreditTransaction[] = Array.from(
  { length: 30 },
  (_, i) => {
    const type = r(["credit", "debit"]);
    return {
      id: rid(),
      tenant_id: "t1",
      transaction_type: type,
      credits:
        type === "credit"
          ? 500 + Math.floor(Math.random() * 2000)
          : 10 + Math.floor(Math.random() * 200),
      amount: type === "credit" ? Math.floor(Math.random() * 100) + 10 : null,
      note:
        type === "credit"
          ? "Credits purchased"
          : `Campaign send - ${r(mockCampaigns).name}`,
      created_at: rdate(60),
    };
  },
);
