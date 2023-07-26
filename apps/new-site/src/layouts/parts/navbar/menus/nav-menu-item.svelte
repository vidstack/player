<script lang="ts">
  import ArrowRightIcon from '~icons/lucide/arrow-right';
  import clsx from 'clsx';
  import type { Action } from 'svelte/action';
  import { navIcons } from '../nav-icons';
  import type { NavMenuItem } from '../navigation';
  import NavMenuItemBadge from './nav-menu-item-badge.svelte';

  export let item: NavMenuItem;
  export let invertColors = false;
  export let action: Action = () => void 0;

  let _as: 'a' | 'button' | 'div';
  export { _as as as };
</script>

<svelte:element
  this={_as}
  {...$$restProps}
  class={clsx(
    'w-full nav-lg:w-auto flex flex-col px-2 py-4 nav-lg:px-4 nav-lg:py-5 focus-visible:ring-0 ',
    $$restProps.class,
  )}
  href={_as === 'a' ? item.href : null}
  role="menuitem"
  tabindex="0"
  aria-label={item.title}
  use:action
>
  <div class="flex items-center w-full">
    <h1 class="text-[15px] nav-lg:text-base flex items-center">
      {#if item.icon && navIcons[item.icon]}
        <svelte:component
          this={navIcons[item.icon]}
          class="mr-1.5 w-4 h-4 nav-lg:w-[19px] nav-lg:h-[19px]"
        />
      {/if}

      {item.title}
    </h1>

    {#if item.badge}
      <NavMenuItemBadge title={item.badge} {invertColors} />
    {/if}
  </div>

  {#if item.description}
    <p class="text-[13px] nav-lg:text-sm mt-2 text-soft nav-lg:max-w-[260px] text-start">
      {item.description}
    </p>
  {/if}

  {#if item.href && _as !== 'a'}
    <a class="text-brand text-[13px] nav-lg:text-sm mt-2 group flex items-center" href={item.href}>
      Learn More
      <ArrowRightIcon
        class="-translate-x-2 opacity-0 group-hocus:opacity-100 group-hocus:translate-x-px transition-all w-3.5 h-3.5"
      />
    </a>
  {/if}
</svelte:element>
