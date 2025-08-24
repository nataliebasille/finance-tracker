<script lang="ts">
	import { type SuperValidated } from 'sveltekit-superforms';
	import type { IncomeLineItem } from '../+contexts/finance-sheet.context';
	import IncomeLineItemContainer from './IncomeLineItemContainer.svelte';
	import * as Card from '$lib/components/ui/card';

	const {
		incomeItemForms
	}: {
		incomeItemForms: SuperValidated<IncomeLineItem>[];
	} = $props();
</script>

<Card.Root>
	<Card.Header>Income</Card.Header>

	<Card.Content>
		{#each incomeItemForms as item}
			<IncomeLineItemContainer {item} />
		{/each}
	</Card.Content>
</Card.Root>
