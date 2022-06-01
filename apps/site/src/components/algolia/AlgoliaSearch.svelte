<script lang="ts">
  // @ts-expect-error - no types.
  import docsearch from '@docsearch/js';

  import { jsLib } from '$src/stores/js-lib';

  import clsx from 'clsx';
  import { onMount } from 'svelte';
  import AlgoliaSkeleton from './AlgoliaSkeleton.svelte';

  export let appId: string;
  export let indexName: string;
  export let apiKey: string;
  export let placeholder = 'Search documentation';

  let container;
  let mounted = false;

  onMount(() => {
    docsearch({
      container,
      placeholder,
      appId,
      indexName,
      apiKey,
      searchParameters: {
        facetFilters: [`jslib:${$jsLib}`, `version:latest`],
      },
    });

    mounted = true;
    return () => {
      mounted = false;
    };
  });
</script>

<svelte:head>
  {#key appId}
    <link rel="preconnect" href={`https://${appId}-dsn.algolia.net`} crossorigin="" />
  {/key}
</svelte:head>

<div class="contents" bind:this={container} />

<div class={clsx(mounted ? 'hidden' : 'contents')}>
  <AlgoliaSkeleton />
</div>
