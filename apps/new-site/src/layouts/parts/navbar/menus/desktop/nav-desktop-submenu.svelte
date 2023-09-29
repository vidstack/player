<script lang="ts">
  import clsx from 'clsx';

  import type { NavSubmenu } from '../../../../nav/nav-items';
  import NavMenuItem from '../nav-menu-item.svelte';
  import NavFeatureGrid from './nav-feature-grid.svelte';

  export let item: NavSubmenu;
</script>

<!-- Submenu Trigger -->
<NavMenuItem
  {item}
  {...$$restProps}
  class={clsx(
    'hocus:text-white hocus:dark:text-black',
    'aria-expanded:text-white aria-expanded:dark:text-black',
    'cursor-pointer hocus:bg-elevate aria-expanded:bg-elevate',
    $$restProps.class,
  )}
  as="button"
  data-submenu-trigger
/>

<!-- Submenu -->
<div
  class={clsx(
    'min-w-[300px] 1200:min-w-[600px] pl-8 pr-4 1200:pl-10 1200:pr-4 border border-border/90 shadow-md',
    'rounded-r-md bg-elevate h-full outline-none',
    'flex 1200:items-center 1200:justify-center overflow-y-scroll 1200:overflow-visible scrollbar',
    'slide-in-from-left-4 fade-in animate-in duration-300',
    'aria-hidden:slide-out-to-left-2 aria-hidden:fade-out aria-hidden:animate-out',
  )}
  style="display: none;"
  data-submenu
  data-hover
  data-placement="right-start"
>
  {#if item.featured}
    <NavFeatureGrid items={item.items} />
  {:else}
    <div class="flex flex-col">
      {#each item.items as menuItem}
        <NavMenuItem
          role="menuitem"
          item={menuItem}
          tabindex={-1}
          as={menuItem.href ? 'a' : 'div'}
        />
      {/each}
    </div>
  {/if}

  <div class="arrow" data-submenu-arrow></div>
</div>
