export interface Promotion {
  id: string;
  tenant_id: string;
  company_id: string | null;
  name: string;
  promotion_type: string;
  discount_type: string;
  discount_value: number;
  start_at: string;
  end_at: string;
  status: string;
}

export interface PromotionRule {
  id: string;
  promotion_id: string;
  rule_type: string;
  rule_value: string;
}

function rid() {
  return crypto.randomUUID();
}

function r<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const promoTypes = ["percentage", "fixed", "bogo", "free_shipping"];
const discountTypes = ["percentage", "fixed_amount"];
const promoStatuses = ["active", "scheduled", "expired", "draft"];
const ruleTypes = [
  "min_order",
  "max_discount",
  "category",
  "customer_segment",
  "min_quantity",
  "payment_method",
];

export const mockPromotions: Promotion[] = Array.from(
  { length: 25 },
  (_, i) => {
    const start = new Date();
    start.setDate(start.getDate() - Math.floor(Math.random() * 30));
    const end = new Date(start);
    end.setDate(end.getDate() + Math.floor(Math.random() * 60));
    return {
      id: rid(),
      tenant_id: "t1",
      company_id: i % 4 === 0 ? rid() : null,
      name: `${r(["Spring", "Summer", "Flash", "VIP", "Holiday", "Weekend", "New Year", "Black Friday"])} ${r(["Sale", "Promo", "Offer", "Deal", "Special"])} ${i + 1}`,
      promotion_type: r(promoTypes),
      discount_type: r(discountTypes),
      discount_value: r([5, 10, 15, 20, 25, 30, 50]),
      start_at: start.toISOString(),
      end_at: end.toISOString(),
      status: r(promoStatuses),
    };
  },
);

export const mockRules: PromotionRule[] = mockPromotions.flatMap((p) =>
  Array.from({ length: Math.ceil(Math.random() * 3) }, () => ({
    id: rid(),
    promotion_id: p.id,
    rule_type: r(ruleTypes),
    rule_value: r([
      "100",
      "50",
      "electronics",
      "vip",
      "3",
      "credit_card",
      "200",
      "clothing",
    ]),
  })),
);
