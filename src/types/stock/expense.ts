import { ListQuery } from "@/lib/api";
import { FinanceAccountResponse } from "../finance/account";
import { ExpenseCategoryResponse } from "./expense-category";

export type ExpensePayload = {
  accountId: string;
  expenseCategoryId: string;
  title: string;
  amount: number;
  expenseDate: string;
  note?: string;
};

export type ExpenseStatus =
  | "DRAFT"
  | "PAID"
  | "CANCELLED";


export type ExpenseResponse = {
  id: string;
  businessId: string;
  accountId: string;
  expenseCategoryId: string;
  expenseNo: string;
  referenceNo: string | null;
  title: string;
  amount: string;
  expenseDate: string;
  note: string | null;
  status: ExpenseStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  account: FinanceAccountResponse;
  category: ExpenseCategoryResponse;
};

export type ExpenseQuery = ListQuery & {
  status?: ExpenseStatus;
}