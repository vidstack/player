<script>
  export let layouts = [];
  export let index = 0;

  $: layout = layouts[index];
</script>

{#await layout.loader() then { default: component }}
  <svelte:component this={component}>
    {#if index + 1 < layouts.length}
      <svelte:self {layouts} index={index + 1}>
        <slot />
      </svelte:self>
    {:else}
      <slot />
    {/if}
  </svelte:component>
{/await}
