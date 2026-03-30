export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string;
  created_at: string;
}

export const INCOME_CATEGORIES = [
  "급여", "부수입", "투자수익", "용돈", "기타수입",
];

export const EXPENSE_CATEGORIES = [
  "식비", "교통", "주거", "통신", "구독", "쇼핑", "의료", "여가", "교육", "경조사", "보험", "저축", "기타",
];
