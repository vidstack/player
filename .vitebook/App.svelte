<script lang="ts">
  import type { SvelteComponent } from 'svelte';

  export let component: typeof SvelteComponent;
</script>

<svelte:component this={component} />

<style>
  :global(.navbar__logo) {
    display: flex;
    align-items: center;
  }
</style>
