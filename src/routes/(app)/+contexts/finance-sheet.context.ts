import { getContext, setContext } from "svelte"

export type FinanceSheetLineItem = {
  type: 'withdraw' | 'deposit' | 'transfer',
  amount: number,
  date: Date,
  description?: string
}

export type FinanceSheet = {
  income: FinanceSheetLineItem[],
  expenses: Record<string, FinanceSheetLineItem[]>,
  savings: FinanceSheetLineItem[]
}

const FINANCE_KEY = Symbol('financeSheet');

export const setFinanceSheet = (sheet: FinanceSheet) => {
  setContext<FinanceSheet>(FINANCE_KEY, sheet);
}

export const useFinanceSheet = (): FinanceSheet => {
  const sheet = getContext<FinanceSheet>(FINANCE_KEY);
  if (!sheet) {
    throw new Error('FinanceSheet context is not set');
  }
  return sheet;
}