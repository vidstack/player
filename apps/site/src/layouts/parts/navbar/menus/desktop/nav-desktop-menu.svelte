<script lang="ts">
  import clsx from 'clsx';

  import type { NavMenuItems } from '../../../../nav/nav-items';
  import NavMenuItem from '../nav-menu-item.svelte';
  import NavMenuTrigger from '../nav-menu-trigger.svelte';
  import NavMenu from '../nav-menu.svelte';
  import NavDesktopSubmenu from './nav-desktop-submenu.svelte';

  export let title: string;
  export let items: NavMenuItems;
  export let grid = false;

  const menuItemClassList = clsx(grid ? 'nav-lg:p-5' : 'nav-lg:p-4 1200:p-5');
</script>

<NavMenuTrigger {title} />

<NavMenu
  {items}
  {grid}
  class={clsx(
    'animate-in slide-out-to-bottom-4 fade-in duration-300 nav-lg:translate-y-1',
    'aria-hidden:animate-out aria-hidden:fade-out aria-hidden:slide-out-to-top-2',
  )}
>
  <svelte:fragment let:item>
    {#if 'items' in item}
      <NavDesktopSubmenu class={menuItemClassList} {item} />
    {:else}
      <NavMenuItem class={menuItemClassList} {item} as={item.href ? 'a' : 'div'} />
    {/if}
  </svelte:fragment>
</NavMenu>
