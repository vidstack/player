<script>
	import '@docsearch/css';
	import '$styles/docsearch.css';

	// @ts-expect-error - no types.
	import docsearch from '@docsearch/js';

	import clsx from 'clsx';
	import { onMount } from 'svelte';
	import DocSearchSkeleton from './DocSearchSkeleton.svelte';

	let container;
	let mounted = false;

	onMount(() => {
		docsearch({
			container,
			placeholder: 'Search documentation',
			appId: 'JV3QY1UI79',
			indexName: 'vidstack',
			apiKey: '03b81ed3b7849b33599967cec76734fe'
		});

		mounted = true;
		return () => {
			mounted = false;
		};
	});
</script>

<svelte:head>
	<link rel="preconnect" href="https://JV3QY1UI79-dsn.algolia.net" crossorigin="" />
</svelte:head>

<div class="contents" bind:this={container} />

<div class={clsx(mounted ? 'hidden' : 'contents')}>
	<DocSearchSkeleton />
</div>
