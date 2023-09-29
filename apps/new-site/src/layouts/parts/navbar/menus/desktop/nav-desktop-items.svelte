<script lang="ts">
  import type { NavItem } from '../../../../nav/nav-items';
  import NavItems from '../nav-items.svelte';
  import NavLink from '../nav-link.svelte';
  import NavDesktopMenu from './nav-desktop-menu.svelte';

  export let navItems: NavItem[];
  export let pathname = '';
</script>

<NavItems>
  {#each navItems as item}
    {#if 'href' in item}
      <li>
        <NavLink {item} {pathname} />
      </li>
    {:else}
      <li>
        <NavDesktopMenu {...item} />
      </li>
    {/if}
  {/each}
</NavItems>
