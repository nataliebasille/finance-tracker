import { getContext, setContext } from 'svelte';
import { z } from 'zod';

export const baseFinanceSheetLineItem = z.object({
	amount: z.number().int().min(0),
	estimate: z.number().int().min(0).optional(),
	date: z.date().optional(),
	description: z.string().optional(),
	disabledFields: z
		.array(z.enum(['amount', 'estimate', 'date', 'description']))
		.optional()
});

export const incomeLineItem = baseFinanceSheetLineItem.extend({
	type: z.literal('deposit')
});
export type IncomeLineItem = z.infer<typeof incomeLineItem>;

export const expenseItem = baseFinanceSheetLineItem.extend({
	type: z.literal('withdraw')
});
export type ExpenseItem = z.infer<typeof expenseItem>;

export const transferItem = baseFinanceSheetLineItem.extend({
	type: z.literal('transfer')
});
export type TransferItem = z.infer<typeof transferItem>;

export type FinanceSheetLineItem = IncomeLineItem | ExpenseItem | TransferItem;

export type FinanceSheet = {
	income: IncomeLineItem[];
	expenses: Record<string, ExpenseItem[]>;
	savings: TransferItem[];
};

const FINANCE_KEY = Symbol('financeSheet');

export const setFinanceSheet = (sheet: FinanceSheet) => {
	setContext<FinanceSheet>(FINANCE_KEY, sheet);
};

export const useFinanceSheet = (): FinanceSheet => {
	const sheet = getContext<FinanceSheet>(FINANCE_KEY);
	if (!sheet) {
		throw new Error('FinanceSheet context is not set');
	}
	return sheet;
};
