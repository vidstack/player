<script lang="ts">
  import type { SvelteComponent } from 'svelte';

  export let component: typeof SvelteComponent;
</script>

<svelte:component this={component} />

<style>
  :global(.navbar__logo) {
    display: none;
  }

  :global(.control) {
    display: flex;
    flex-direction: column;
    margin-top: 16px;
  }

  :global(.control > span) {
    display: block;
  }

  :global(.control > input) {
    margin-top: 8px;
  }

  :global(.control > input[type='text']) {
    width: 100%;
  }
</style>
