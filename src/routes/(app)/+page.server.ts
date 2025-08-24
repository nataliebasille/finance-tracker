import { runAppEffect } from '$lib/server/effect';
import { Effect } from 'effect';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { incomeLineItem } from './+contexts/finance-sheet.context';

export const load = () =>
	runAppEffect(
		Effect.tryPromise(async () => {
			const incomeItemForms = [
				await superValidate(
					{
						amount: 0,
						description: 'Pay'
					},
					zod(incomeLineItem)
				)
			];

			return { incomeItemForms };
		})
	);
