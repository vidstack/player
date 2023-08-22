<script lang="ts">
  import clsx from 'clsx';

  import { offset as _offset } from '@floating-ui/dom';

  import { createAriaMenu, type AriaMenuOptions } from '../aria/menu';

  export let as = 'button';
  export let offset = 8;

  export let options: AriaMenuOptions = {
    placement: 'bottom',
  };

  const { menuTrigger, menu, isMenuOpen, isMenuVisible } = createAriaMenu({
    ...options,
    middleware: [_offset(offset), ...(options.middleware || [])],
  });
</script>

<svelte:element this={as} {...$$restProps} use:menuTrigger>
  <slot name="trigger" />
</svelte:element>

<div
  class={clsx(
    'z-50 rounded-md border border-border bg-elevate text-xs font-medium p-3',
    'outline-none shadow-md',
    $isMenuOpen
      ? 'animate-in fade-in slide-in-from-top-4'
      : 'animate-out fade-out slide-out-to-top-2',
  )}
  style="display: none;"
  use:menu
>
  {#if $isMenuVisible}
    <slot name="content" />
  {/if}
</div>
