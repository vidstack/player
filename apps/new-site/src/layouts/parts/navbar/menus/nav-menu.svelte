<script lang="ts">
  import { createDropdownMenu } from '@melt-ui/svelte';
  import ChevronDownIcon from '~icons/lucide/chevron-down';
  import clsx from 'clsx';
  import type { NavMenuItems } from '../navigation';
  import NavMenuItem from './nav-menu-item.svelte';
  import NavSubmenu from './nav-submenu.svelte';

  export let title: string;
  export let items: NavMenuItems;
  export let grid = false;
  export let placement: string | undefined = undefined;

  const {
    menu,
    open: isMenuOpen,
    trigger: menuTrigger,
    item: menuItem,
    createSubMenu,
  } = createDropdownMenu({
    positioning: {
      placement: (placement as any) ?? 'bottom-start',
    },
    loop: true,
    preventScroll: false,
  });
</script>

<!-- Menu Trigger -->
<button
  {...$$restProps}
  class={clsx(
    'group relative flex transform-gpu items-center rounded-md border-0 p-2 min-w-[40px] min-h-[40px]',
    'transition-transform hover:scale-105',
    $$restProps.class,
  )}
  {...$menuTrigger}
  use:menuTrigger
>
  {title}
  <ChevronDownIcon
    class={clsx('ml-[3px] transition-transform', $isMenuOpen && 'rotate-180')}
    width={16}
    height={16}
  />
</button>

<!-- Menu -->
<div
  class={clsx('border-border border bg-body outline-none', grid && 'grid grid-cols-2')}
  {...$menu}
  use:menu
>
  {#each items as item}
    {#if 'items' in item}
      <NavSubmenu {item} {createSubMenu} />
    {:else}
      <NavMenuItem {item} {...$menuItem} action={menuItem} />
    {/if}
  {/each}
</div>
