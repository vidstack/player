<script lang="ts">
  import clsx from 'clsx';

  import ArrowRightIcon from '~icons/lucide/arrow-right';

  import type { Action } from 'svelte/action';

  import StageBadge from '../../../../components/stage-badge.svelte';
  import { noop } from '../../../../utils/unit';
  import type { NavMenuItem } from '../../../nav/nav-items';

  export let item: NavMenuItem;
  export let action: Action = noop;

  let _as: 'a' | 'button' | 'div';
  export { _as as as };

  export let heading = false;
</script>

<svelte:element
  this={_as}
  {...$$restProps}
  class={clsx(
    'group relative w-full nav-lg:w-auto flex flex-col px-2 py-2.5 focus-visible:ring-0 rounded-sm',
    $$restProps.class,
  )}
  href={_as === 'a' ? item.href : null}
  role="menuitem"
  tabindex="0"
  aria-label={item.title}
  use:action
>
  <div class="flex items-center w-full">
    <svelte:element
      this={heading ? 'h1' : 'div'}
      class="text-[15px] nav-lg:text-base flex items-center"
    >
      {#if item.Icon}
        <svelte:component this={item.Icon} class="mr-1.5" />
      {/if}

      {item.title}
    </svelte:element>

    {#if item.stage}
      <StageBadge stage={item.stage} />
    {/if}
  </div>

  {#if item.description}
    <p class="text-sm nav-lg:text-sm mt-2 nav-lg:mt-1.5 text-soft nav-lg:max-w-[260px] text-start">
      {item.description}
    </p>
  {/if}

  {#if item.href && _as !== 'a'}
    <a class="text-brand text-sm mt-2 nav-lg:mt-1.5 group flex items-center" href={item.href}>
      Learn More
      <ArrowRightIcon
        class="-translate-x-2 opacity-0 group-hocus:opacity-100 group-hocus:translate-x-px transition-all w-3.5 h-3.5"
      />
    </a>
  {/if}
</svelte:element>
