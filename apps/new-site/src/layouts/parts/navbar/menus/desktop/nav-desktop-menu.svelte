<script lang="ts">
  import clsx from 'clsx';
  import type { NavMenuItems } from '../../navigation';
  import NavMenuItem from '../nav-menu-item.svelte';
  import NavMenu from '../nav-menu.svelte';
  import NavDesktopSubmenu from './nav-desktop-submenu.svelte';

  export let title: string;
  export let items: NavMenuItems;
  export let grid = false;

  const menuItemClassList = clsx(grid ? 'nav-lg:p-5' : 'nav-lg:p-4 1200:p-5');
</script>

<NavMenu {title} {items} {grid}>
  <svelte:fragment let:item>
    {#if 'items' in item}
      <NavDesktopSubmenu class={menuItemClassList} {item} />
    {:else}
      <NavMenuItem class={menuItemClassList} {item} as={item.href ? 'a' : 'div'} />
    {/if}
  </svelte:fragment>
</NavMenu>
