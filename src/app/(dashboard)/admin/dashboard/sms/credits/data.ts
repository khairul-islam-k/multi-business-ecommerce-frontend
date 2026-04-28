export interface SmsCreditWallet {
  id: string;
  tenant_id: string;
  balance: number;
  used_this_month: number;
  updated_at: string;
}

function rid() {
  return crypto.randomUUID();
}

export const mockWallet: SmsCreditWallet = {
  id: rid(),
  tenant_id: "t1",
  balance: 4250,
  used_this_month: 1750,
  updated_at: new Date().toISOString(),
};
