<script lang="ts">
  import clsx from 'clsx';
  import type { NavMenuItems } from '../../navigation';
  import NavMenuItem from '../nav-menu-item.svelte';
  import NavMenu from '../nav-menu.svelte';
  import NavDesktopSubmenu from './nav-desktop-submenu.svelte';

  export let title: string;
  export let items: NavMenuItems;
  export let grid = false;
</script>

<NavMenu {title} {items} {grid}>
  <svelte:fragment let:item>
    {#if 'items' in item}
      <NavDesktopSubmenu {item} />
    {:else}
      <NavMenuItem
        class={clsx(!grid && 'first:pt-8 last:pb-6')}
        {item}
        as={item.href ? 'a' : 'div'}
      />
    {/if}
  </svelte:fragment>
</NavMenu>
