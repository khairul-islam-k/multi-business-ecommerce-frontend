export const mockRules = [
  {
    id: "1",
    name: "High-value orders",
    condition: "Order > ₹10,000",
    gateway: "Razorpay",
    priority: "1",
    status: "active",
  },
  {
    id: "2",
    name: "International cards",
    condition: "Currency ≠ INR",
    gateway: "Stripe",
    priority: "2",
    status: "active",
  },
];
