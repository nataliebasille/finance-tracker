<script lang="ts">
	import GoogleSignInButton from './google/GoogleSignInButton.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Separator from '$lib/components/ui/separator';
</script>

<div class="flex h-screen w-screen items-center justify-center bg-accent">
	<Card.Root class="gap-4">
		<Card.Header class="text-center">
			<Card.Title class="text-3xl tracking-tighter">Basille's</Card.Title>
			<Card.Description class="text-xl text-nowrap uppercase">Finance tracker</Card.Description>
		</Card.Header>

		<Separator.Root />

		<Card.Footer class="px-4">
			<GoogleSignInButton class="w-full" />
		</Card.Footer>
	</Card.Root>
</div>
