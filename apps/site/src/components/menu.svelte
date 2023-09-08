<script lang="ts">
  import clsx from 'clsx';

  import { type Placement } from '@floating-ui/dom';

  import { createAriaMenu } from '../aria/menu';

  export let as = 'button';
  export let offset = 8;
  export let hover = false;
  export let placement: Placement = 'bottom';
  export let type: 'menu' | 'dialog' = 'menu';

  const { menuTrigger, menu, isMenuOpen, isMenuVisible } = createAriaMenu({
    placement,
    type,
    offset,
    hover,
  });
</script>

<svelte:element this={as} {...$$restProps} use:menuTrigger>
  <slot name="trigger" />
</svelte:element>

<div
  class={clsx(
    'z-50 rounded-md border border-border/90 bg-elevate text-xs font-medium p-3',
    'outline-none shadow-md',
    $isMenuOpen
      ? clsx(
          'animate-in fade-in',
          placement.includes('bottom') ? 'slide-in-from-top-4' : 'slide-in-from-bottom-4',
        )
      : clsx(
          'animate-out fade-out',
          placement.includes('bottom') ? 'slide-out-to-top-2' : 'slide-out-to-bottom-2',
        ),
  )}
  style="display: none;"
  use:menu
>
  {#if $isMenuVisible}
    <slot name="content" />
  {/if}
</div>
