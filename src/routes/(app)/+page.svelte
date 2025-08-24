<script>
	import SheetGroup from './+components/sheet-group.svelte';
	import IncomeContainer from './+containers/IncomeContainer.svelte';

	const { data } = $props();
</script>

<div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
	<div class="grid grid-cols-[1fr_auto_auto] gap-4 pt-8">
		<SheetGroup name="Income" items={data.incomeItemForms} />
	</div>
	<!-- <IncomeContainer incomeItemForms={data.incomeItemForms} /> -->
</div>
