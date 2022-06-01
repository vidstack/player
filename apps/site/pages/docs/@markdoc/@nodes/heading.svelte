<script>
  export let id;
  export let level;
  export let anchor = true;
</script>

<svelte:element this={`h${level}`} {id} tabindex="-1">
  {#if anchor}
    {#if level > 1}
      <a href={`#${id}`} class="header-anchor" aria-hidden="true">#</a>
    {/if}
  {/if}
  <slot />
</svelte:element>
