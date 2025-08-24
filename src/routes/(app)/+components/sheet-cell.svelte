<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import type { FsSuperForm } from 'formsnap';
	import {
		type FinanceSheetLineItem,
		baseFinanceSheetLineItem
	} from '../+contexts/finance-sheet.context';
	import { cn, schemaToHtmlInputType } from '$lib/utils';
	import DollarSign from '~icons/lucide/dollar-sign';
	import EditableInput from '$lib/components/ui/input/editable-input.svelte';

	type SheetFieldProps = {
		form: FsSuperForm<FinanceSheetLineItem>;
		name: Exclude<keyof FinanceSheetLineItem, 'type' | 'disabledFields'>;
		class?: string;
	};

	const { form, name, class: className }: SheetFieldProps = $props();

	const { form: formData, enhance } = form;
	const isCurrency = name === 'estimate' || name === 'amount';
	const inputType = schemaToHtmlInputType(baseFinanceSheetLineItem.shape[name]);
</script>

<form method="POST" class={className} use:enhance>
	<Form.Field {form} {name}>
		{#snippet children({ constraints })}
			<Form.Control>
				{#snippet children({ props })}
					<div class="relative">
						<EditableInput
							type={inputType}
							class={cn(isCurrency && 'pl-5')}
							disabled={$formData.disabledFields?.includes(name)}
							bind:value={$formData[name]}
							{...props}
							{...constraints}
						></EditableInput>

						{#if isCurrency}
							<DollarSign class="absolute top-3.5 left-1 size-3" />
						{/if}
					</div>
				{/snippet}
			</Form.Control>
		{/snippet}
	</Form.Field>
</form>
