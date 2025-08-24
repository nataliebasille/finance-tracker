<script lang="ts">
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import {
		type IncomeLineItem,
		incomeLineItem
	} from '../+contexts/finance-sheet.context';
	import * as Form from '$lib/components/ui/form';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '$lib/components/ui/input';

	const {
		item
	}: {
		item: SuperValidated<IncomeLineItem>;
	} = $props();

	const form = superForm(item, {
		validators: zodClient(incomeLineItem)
	});

	const { form: formData } = form;
</script>

<form>
	<Form.Field {form} name="description">
		<Form.Control>
			{#snippet children({ props })}
				<Input {...props} bind:value={$formData.description} />
			{/snippet}
		</Form.Control>
	</Form.Field>
</form>
