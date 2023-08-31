<script lang="ts">
  import docsearch from '@docsearch/js';

  import { currentJSLibrary } from '../../stores/libraries';

  let appId = 'JV3QY1UI79',
    indexName = 'vidstack',
    apiKey = '03b81ed3b7849b33599967cec76734fe',
    placeholder = 'Search documentation';

  let container: HTMLElement;

  $: if (container) {
    docsearch({
      container,
      placeholder,
      appId,
      indexName,
      apiKey,
      searchParameters: {
        facetFilters: [`jslib:${$currentJSLibrary}`, `version:latest`],
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
</script>

<svelte:head>
  {#key appId}
    <link rel="preconnect" href={`https://${appId}-dsn.algolia.net`} crossorigin="" />
  {/key}
</svelte:head>

<div class="contents" bind:this={container} />
