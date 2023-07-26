<script lang="ts">
  import type { NavMenuItems } from '../../navigation';
  import NavMenuItem from '../nav-menu-item.svelte';
  import NavMenu from '../nav-menu.svelte';
  import NavMobileSubmenu from './nav-mobile-submenu.svelte';

  export let title: string;
  export let items: NavMenuItems;
</script>

<NavMenu {title} {items} noPositioning>
  <svelte:fragment let:item>
    {#if 'items' in item}
      <NavMobileSubmenu {item} />
    {:else}
      <NavMenuItem {item} as={item.href ? 'a' : 'div'} />
    {/if}
  </svelte:fragment>
</NavMenu>
