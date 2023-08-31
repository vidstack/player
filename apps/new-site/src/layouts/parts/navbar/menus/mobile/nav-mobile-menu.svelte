<script lang="ts">
  import clsx from 'clsx';

  import type { NavMenuItems } from '../../../../nav/nav-items';
  import NavMenuItem from '../nav-menu-item.svelte';
  import NavMenuTrigger from '../nav-menu-trigger.svelte';
  import NavMenu from '../nav-menu.svelte';
  import NavMobileSubmenu from './nav-mobile-submenu.svelte';

  export let title: string;
  export let items: NavMenuItems;
  export let pathname = '';
</script>

<NavMenuTrigger {title} />

<NavMenu data-placement="none" {items}>
  <svelte:fragment let:item>
    {#if 'items' in item}
      <NavMobileSubmenu {item} />
    {:else}
      <NavMenuItem
        class={clsx(
          !item.description &&
            (item.href === pathname ? 'text-brand font-medium' : 'text-soft hocus:text-inverse'),
        )}
        {item}
        as={item.href ? 'a' : 'div'}
        data-active={item.href === pathname ? '' : null}
      />
    {/if}
  </svelte:fragment>
</NavMenu>
