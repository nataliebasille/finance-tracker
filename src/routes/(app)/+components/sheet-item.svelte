<script lang="ts">
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import type { FinanceSheetLineItem } from '../+contexts/finance-sheet.context';
	import SheetField from './sheet-field.svelte';

	type SheetItemProps = {
		item: SuperValidated<FinanceSheetLineItem>;
	};

	const { item }: SheetItemProps = $props();
	const form = superForm(item);

	const { form: formData, enhance } = form;
</script>

<SheetField {form} name="description" />
<SheetField {form} name="estimate" class="w-[125px]" />
<SheetField {form} name="amount" class="w-[125px]" />
