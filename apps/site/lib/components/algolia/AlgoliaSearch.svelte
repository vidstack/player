<script lang="ts">
  import docsearch from '@docsearch/js';
  import clsx from 'clsx';
  import { onMount } from 'svelte';

  import { jsLib } from '$lib/stores/js-lib';

  import AlgoliaSkeleton from './AlgoliaSkeleton.svelte';

  export let appId: string;
  export let indexName: string;
  export let apiKey: string;
  export let placeholder = 'Search documentation';

  let container;
  let mounted = false;

  $: if (container) {
    docsearch({
      container,
      placeholder,
      appId,
      indexName,
      apiKey,
      searchParameters: {
        facetFilters: [`jslib:${$jsLib}`, `version:latest`],
      },
      transformItems(items) {
        return items.map((item) => {
          const url = new URL(item.url);

          if (item.type === 'lvl3' && item.hierarchy.lvl2) {
            item._snippetResult.hierarchy.lvl1.value = `${item.hierarchy.lvl1} > ${item.hierarchy.lvl2}`;
          }

          if (item.type === 'lvl4' && item.hierarchy.lvl3) {
            item._snippetResult.hierarchy.lvl1.value = `${item.hierarchy.lvl1} > ${item.hierarchy.lvl2} > ${item.hierarchy.lvl3}`;
          }

          return {
            ...item,
            url: `${url.pathname}${url.hash || ''}`,
          };
        });
      },
    });
  }

  onMount(() => {
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
