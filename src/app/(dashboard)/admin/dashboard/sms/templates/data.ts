export interface SmsTemplate {
  id: string;
  tenant_id: string;
  name: string;
  category: string;
  content: string;
  status: string;
}

const names = [
  "Flash Sale Alert",
  "Welcome Message",
  "Order Confirmation",
  "Shipping Update",
  "Promo Offer",
  "Loyalty Reward",
  "Cart Reminder",
  "Feedback Request",
  "Holiday Special",
  "Restock Notice",
  "Payment Reminder",
  "New Arrival",
];
const categories = ["Promotional", "Transactional", "Notification", "Alert"];

const statuses = ["active", "draft", "inactive"];

function r<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rid() {
  return crypto.randomUUID();
}

export const mockTemplates: SmsTemplate[] = names.map((name, i) => ({
  id: rid(),
  tenant_id: "t1",
  name,
  category: r(categories),
  content: `Hi {{name}}, ${name.toLowerCase()} message content here. Reply STOP to opt out.`,
  status: r(statuses),
}));
