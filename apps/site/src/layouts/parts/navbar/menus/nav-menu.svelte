<script lang="ts">
  import clsx from 'clsx';

  import type { NavMenuItems } from '../../../nav/nav-items';

  export let items: NavMenuItems;
  export let grid = false;
</script>

<div
  {...$$restProps}
  class={clsx(
    'nav-lg:border-border/90 nav-lg:border bg-body nav-lg:bg-elevate outline-none transition rounded-md nav-lg:shadow-md',
    grid ? 'nav-lg:grid nav-lg:grid-cols-2 nav-lg:p-2 1200:gap-x-1' : 'px-2 nav-lg:px-0',
    $$restProps.class,
  )}
  data-menu
  style={clsx('display: none', $$restProps.style)}
>
  {#each items as item}
    <slot {item} />
  {/each}
</div>
