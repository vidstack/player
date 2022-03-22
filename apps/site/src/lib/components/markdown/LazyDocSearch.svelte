<script>
	import DocSearchSkeleton from './DocSearchSkeleton.svelte';

	let hasDocSearchLoaded = false;
	const DocSearchLoader = async () => {
		const Component = await import('$components/markdown/DocSearch.svelte');
		hasDocSearchLoaded = true;
		return Component;
	};
</script>

{#if !hasDocSearchLoaded}
	<DocSearchSkeleton />
{/if}

{#await DocSearchLoader() then Component}
	<svelte:component this={Component.default} />
{/await}
