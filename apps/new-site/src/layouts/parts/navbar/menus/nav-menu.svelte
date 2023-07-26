<script lang="ts">
  import ChevronDownIcon from '~icons/lucide/chevron-down';
  import clsx from 'clsx';
  import { createAriaMenu } from '../../../../aria/menu';
  import type { NavMenuItems } from '../navigation';

  export let title: string;
  export let items: NavMenuItems;
  export let grid = false;
  export let noPositioning = false;

  const { menu, menuTrigger, isMenuOpen } = createAriaMenu({
    placement: 'bottom-start',
    noPositioning,
  });
</script>

<!-- Menu Trigger -->
<button
  {...$$restProps}
  class={clsx(
    'group relative flex transform-gpu items-center rounded-md border-0 p-2',
    'min-w-[40px] min-h-[40px] w-full nav-lg:w-auto text-base',
    $$restProps.class,
  )}
  use:menuTrigger
>
  {title}
  <ChevronDownIcon
    class={clsx(
      'nav-lg:ml-[3px] ml-auto transition-transform w-5 h-5 nav-lg:w-4 nav-lg:h-4 group-hocus:animate-pulse',
      $isMenuOpen && 'rotate-180',
    )}
  />
</button>

<!-- Menu -->
<div
  class={clsx(
    'nav-lg:border-border nav-lg:border bg-body outline-none transition',
    grid ? 'nav-lg:grid nav-lg:grid-cols-2 nav-lg:p-2' : 'px-2 nav-lg:px-0',
    $isMenuOpen
      ? 'animate-in slide-out-to-bottom-4 fade-in duration-300 nav-lg:translate-y-1'
      : 'animate-out fade-out slide-out-to-top-2',
  )}
  use:menu
  style="display: none"
>
  {#each items as item}
    <slot {item} />
  {/each}

  <slot name="menu-bottom" />
</div>
