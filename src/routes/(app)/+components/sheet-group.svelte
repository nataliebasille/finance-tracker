<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import * as Form from '$lib/components/ui/form';
	import SheetItem from './sheet-item.svelte';

	import type { SuperValidated } from 'sveltekit-superforms';
	import type { FinanceSheetLineItem } from '../+contexts/finance-sheet.context';

	type SheetGroupProps = {
		name: string;
		items: SuperValidated<FinanceSheetLineItem>[];
	};

	const { name, items }: SheetGroupProps = $props();
</script>

<Card.Root
	class="col-span-full row-span-3 grid grid-cols-subgrid grid-rows-subgrid gap-x-4 gap-y-2 shadow-none"
>
	<Card.Header
		class="[container-type:normal] col-span-full grid grid-flow-col grid-cols-subgrid grid-rows-subgrid gap-[inherit] font-bold tracking-wide"
	>
		<Label class="font-bold underline">Item</Label>
		<Label class="font-bold underline">Estimate</Label>
		<Label class="font-bold underline">Actual</Label>
	</Card.Header>

	<Card.Content
		class="col-span-full grid grid-flow-col grid-cols-subgrid grid-rows-subgrid"
	>
		<div class="col-span-full grid grid-cols-subgrid grid-rows-subgrid">
			{#each items as item (item.id)}
				<SheetItem {item} />
			{/each}
		</div>
	</Card.Content>
</Card.Root>
