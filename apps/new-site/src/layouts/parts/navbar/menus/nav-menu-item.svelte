<script lang="ts">
  import clsx from 'clsx';

  import ArrowRightIcon from '~icons/lucide/arrow-right';

  import type { Action } from 'svelte/action';

  import StageBadge from '../../../../components/stage-badge.svelte';
  import { noop } from '../../../../utils/unit';
  import { navIcons } from '../nav-icons';
  import type { NavMenuItem } from '../navigation';

  export let item: NavMenuItem;
  export let invertTheme = false;
  export let action: Action = noop;

  let _as: 'a' | 'button' | 'div';
  export { _as as as };
</script>

<svelte:element
  this={_as}
  {...$$restProps}
  class={clsx(
    'relative w-full nav-lg:w-auto flex flex-col px-2 py-3.5 focus-visible:ring-0 rounded-sm',
    $$restProps.class,
  )}
  href={_as === 'a' ? item.href : null}
  role="menuitem"
  tabindex="0"
  aria-label={item.title}
  use:action
>
  <div class="flex items-center w-full">
    <h1 class="text-sm nav-lg:text-[15px] font-medium nav-lg:text-base flex items-center">
      {#if item.icon && navIcons[item.icon]}
        <svelte:component this={navIcons[item.icon]} class="mr-1.5" />
      {/if}

      {item.title}
    </h1>

    {#if item.stage}
      <StageBadge stage={item.stage} {invertTheme} />
    {/if}
  </div>

  {#if item.description}
    <p
      class="text-[13px] nav-lg:text-sm mt-2 nav-lg:mt-1.5 text-soft nav-lg:max-w-[260px] text-start"
    >
      {item.description}
    </p>
  {/if}

  {#if item.href && _as !== 'a'}
    <a class="text-brand text-[13px] mt-2 nav-lg:mt-1.5 group flex items-center" href={item.href}>
      Learn More
      <ArrowRightIcon
        class="-translate-x-2 opacity-0 group-hocus:opacity-100 group-hocus:translate-x-px transition-all w-3.5 h-3.5"
      />
    </a>
  {/if}
</svelte:element>
