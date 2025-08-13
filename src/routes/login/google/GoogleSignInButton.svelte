<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import GoogleIcon from '~icons/devicon/google';

	type Props = {
		class?: string;
	};

	const { class: className }: Props = $props();
</script>

<Button href="/login/google" variant="outline" class={className}>
	<GoogleIcon class="mr-2" />
	Sign in with Google
</Button>
