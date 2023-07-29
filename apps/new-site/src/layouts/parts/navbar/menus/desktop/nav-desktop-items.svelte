<script>
  import { mainNavItems } from '../../nav-items';
  import NavItems from '../nav-items.svelte';
  import NavLink from '../nav-link.svelte';
  import NavDesktopMenu from './nav-desktop-menu.svelte';
</script>

<NavItems>
  {#each mainNavItems as item}
    {#if 'href' in item}
      <li>
        <NavLink {item} />
      </li>
    {:else}
      <li>
        <NavDesktopMenu {...item} />
      </li>
    {/if}
  {/each}
</NavItems>
