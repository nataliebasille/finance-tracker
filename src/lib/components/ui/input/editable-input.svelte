<script lang="ts" module>
	import { type InputProps } from './input.svelte';
	import { cn } from '$lib/utils';

	export type EditableInputProps = InputProps;
</script>

<script lang="ts">
	import Input from './input.svelte';
	import Button from '../button/button.svelte';
	import Checkmark from '~icons/lucide/check';
	import Cross from '~icons/lucide/x';
	import Pencil from '~icons/lucide/pencil-line';

	import type { Snippet } from 'svelte';

	const {
		value = $bindable(),
		display,
		class: className,
		inputClass,
		displayClass,
		...restProps
	}: EditableInputProps & {
		inputClass?: string;
		displayClass?: string;
		display?: Snippet<
			[
				{
					value: any;
				}
			]
		>;
	} = $props();

	let currentValue = $state(value);
	let editing = $state(false);
</script>

{#if !restProps.disabled && editing}
	<div class={cn('textbox relative inline-flex w-full', className)}>
		<Input
			bind:value={currentValue}
			class={cn(
				`[appearance:textfield] 
        [&::-webkit-inner-spin-button]:appearance-none 
        [&::-webkit-outer-spin-button]:m-0 
        [&::-webkit-outer-spin-button]:appearance-none`,
				'h-full rounded-none border-none p-0 shadow-none ring-0',
				inputClass
			)}
			{...restProps}
		/>

		<div class="absolute top-1 right-1 flex">
			<Button
				type="button"
				variant="ghost"
				class="size-7 rounded-lg rounded-r-none"
				size="icon"
			>
				<Checkmark />
			</Button>

			<Button
				type="button"
				variant="ghost"
				class="size-7 rounded-lg rounded-l-none"
				size="icon"
				onclick={() => (editing = false)}
			>
				<Cross />
			</Button>
		</div>
	</div>
{:else}
	<div
		class={cn(
			'inline-flex h-9 w-full items-center border-b border-input py-1 pr-1 pl-3',
			className
		)}
	>
		{#if display}
			{@render display?.({ value: currentValue })}
		{:else}
			<span class={cn('flex-1 text-nowrap text-ellipsis', displayClass)}
				>{currentValue}</span
			>
		{/if}
		<Button
			class="size-7 rounded-lg"
			variant="ghost"
			size="icon"
			onclick={() => (editing = true)}
		>
			<Pencil />
		</Button>
	</div>
{/if}
