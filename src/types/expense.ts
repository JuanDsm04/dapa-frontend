export interface ExpenseType {
  id: number;
  type: string;
}

export interface Expense {
  id?: number;
  date: string;
  typeId: number | null;
  expenseType?: string;
  temporalEmployee: boolean;
  description?: string;
  amount: number | null;
}
