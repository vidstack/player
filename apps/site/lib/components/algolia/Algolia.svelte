<script lang="ts">
  import AlgoliaSkeleton from './AlgoliaSkeleton.svelte';

  export let appId: string;
  export let indexName: string;
  export let apiKey: string;
  export let placeholder = 'Search documentation';

  let hasDocSearchLoaded = false;
  const DocSearchLoader = async () => {
    const Component = await import('./AlgoliaSearch.svelte');
    hasDocSearchLoaded = true;
    return Component;
  };
</script>

{#if !hasDocSearchLoaded}
  <AlgoliaSkeleton />
{/if}

{#await DocSearchLoader() then Component}
  <svelte:component this={Component.default} {appId} {indexName} {apiKey} {placeholder} />
{/await}
