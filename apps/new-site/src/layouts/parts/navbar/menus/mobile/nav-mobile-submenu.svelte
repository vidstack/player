<script lang="ts">
  import ArrowRightIcon from '~icons/lucide/arrow-right';
  import clsx from 'clsx';
  import { navIcons } from '../../nav-icons';
  import type { NavSubmenu } from '../../navigation';
  import NavMenuItem from '../nav-menu-item.svelte';

  export let item: NavSubmenu;
</script>

<section>
  <NavMenuItem {item} as="div" />

  <div class="flex flex-col ml-2 mt-2">
    <ul
      class={clsx(
        item.featured
          ? 'grid grid-cols-1 576:grid-cols-2 gap-x-4 gap-y-6'
          : 'flex flex-col space-y-6 list-disc',
      )}
    >
      {#each item.items as menuItem}
        <li class="flex flex-col">
          <h2 class="text-sm flex items-center">
            {#if menuItem.icon && navIcons[menuItem.icon]}
              <svelte:component this={navIcons[menuItem.icon]} class="mr-1.5 w-4 h-4" />
            {/if}
            {menuItem.title}
          </h2>
          <p class="mt-2 text-xs text-soft">{menuItem.description}</p>
          {#if menuItem.href}
            <a class="flex items-center text-brand text-xs mt-2.5 group" href={menuItem.href}>
              Learn More
              <ArrowRightIcon
                class="-translate-x-2 ml-0.5 opacity-0 group-hocus:opacity-100 group-hocus:translate-x-px transition-all w-3 h-3"
              />
            </a>
          {/if}
        </li>
      {/each}
    </ul>
  </div>
</section>

<div role="separator" class="w-full h-px bg-inverse/20 mt-6 mb-2"></div>
