export const mockExpenseCategories = [
  {
    id: "cat-1",
    name: "Office Supplies",
    description: "Stationery",
    status: "Active",
  },
  {
    id: "cat-2",
    name: "Travel",
    description: "Flights & hotels",
    status: "Active",
  },
  { id: "cat-3", name: "Utilities", description: "Bills", status: "Inactive" },
];

export const mockExpenses = [
  {
    id: "exp-1",
    title: "Printer Paper",
    amount: 120,
    expense_category_id: "cat-1",
    category_name: "Office Supplies",
    payment_method: "Cash",
    vendor_name: "ABC Store",
    expense_date: "2024-03-10",
  },
  {
    id: "exp-2",
    title: "Flight Ticket",
    amount: 800,
    expense_category_id: "cat-2",
    category_name: "Travel",
    payment_method: "Card",
    vendor_name: "Emirates",
    expense_date: "2024-04-02",
  },
];
