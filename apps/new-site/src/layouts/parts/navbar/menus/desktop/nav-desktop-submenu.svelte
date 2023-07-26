<script lang="ts">
  import clsx from 'clsx';
  import { createAriaMenu } from '../../../../../aria/menu';
  import type { NavSubmenu } from '../../navigation';
  import NavMenuItem from '../nav-menu-item.svelte';
  import NavFeatureGrid from './nav-feature-grid.svelte';

  export let item: NavSubmenu;

  const { menu, menuTrigger, menuArrow, isMenuOpen } = createAriaMenu({
    placement: 'right-start',
    hover: true,
    submenu: true,
    showDelay: 200,
  });
</script>

<!-- Submenu Trigger -->
<NavMenuItem
  {item}
  class={clsx('cursor-pointer', $isMenuOpen && 'bg-inverse')}
  action={menuTrigger}
  as="button"
  invertColors={$isMenuOpen}
/>

<!-- Submenu -->
<div
  class={clsx(
    'min-w-[300px] 1200:min-w-[600px] pl-8 pr-4 1200:pl-10 1200:pr-4 border border-border',
    'rounded-r-md bg-body h-full outline-none',
    'flex 1200:items-center 1200:justify-center overflow-y-scroll 1200:overflow-visible scrollbar',
    $isMenuOpen
      ? 'slide-in-from-left-4 fade-in animate-in duration-300'
      : 'slide-out-to-left-2 fade-out animate-out duration-300',
  )}
  style="display: none;"
  use:menu
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

  <div class="arrow" use:menuArrow></div>
</div>
