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
	class="col-span-full row-span-3 grid grid-cols-subgrid grid-rows-subgrid gap-x-4 gap-y-2 px-6 shadow-none"
>
	<Card.Header
		class="[container-type:normal] col-span-full mb-2 grid grid-flow-col grid-cols-subgrid grid-rows-subgrid gap-[inherit] border-b border-input p-0 text-lg font-bold tracking-wide [.border-b]:pb-0"
	>
		Income
	</Card.Header>

	<Card.Content
		class="col-span-full grid grid-flow-col grid-cols-subgrid grid-rows-subgrid p-0"
	>
		<div class="col-span-full grid grid-flow-row grid-cols-subgrid gap-x-3 gap-y-2">
			<span class="pl-3 font-bold underline"></span>
			<span class="pl-2 font-bold tracking-wide underline">Estimate</span>
			<span class="pl-2 font-bold tracking-wide underline">Actual</span>

			{#each items as item (item.id)}
				<SheetItem {item} />
			{/each}
		</div>
	</Card.Content>
</Card.Root>
