<script lang="ts">
  import '@docsearch/css/dist/style.css';
  import '../../styles/docsearch.css';
</script>

{#await import('./algolia-search.svelte') then { default: Component }}
  <svelte:component this={Component} />
{/await}
