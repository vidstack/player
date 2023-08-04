<script lang="ts">
  import clsx from 'clsx';
  import { createAriaMenu } from '../../../aria/menu';
  import AnimatedPanelIcon from '../../../icons/animated-panel-icon.svelte';

  const { menu, menuTrigger, isMenuOpen } = createAriaMenu({
    defaultOpen: true,
    noPositioning: true,
    noOutSideClick: true,
  });
</script>

<button
  type="button"
  class={clsx(
    'group flex transform-gpu items-center rounded-md border-0 px-2 py-1 text-soft',
    'hocus:text-inverse fixed top-8 left-0 z-[60] transition-transform duration-300',
    $isMenuOpen ? 'translate-x-[144px]' : 'translate-x-[2px]',
  )}
  aria-label="File Explorer"
  use:menuTrigger
>
  <AnimatedPanelIcon size={18} open={$isMenuOpen} />
</button>

<span
  class={clsx(
    'fixed top-9 left-2 font-semibold z-[60] text-[11px] uppercase text-soft',
    !$isMenuOpen && 'hidden',
  )}
  aria-hidden="true"
>
  Explorer
</span>

<div class={!$isMenuOpen ? 'w-10 h-full border-r border-border' : 'hidden'}></div>

<div
  class={clsx(
    'sticky overflow-y-auto top-0 left-0 w-full scrollbar duration-300 border-r border-border flex-1',
    'bg-body z-50 pt-9 px-1 min-w-[180px] max-w-[180px] transition-all',
    $isMenuOpen
      ? 'animate-in slide-in-from-left-full fade-in'
      : 'animate-out slide-out-to-left-full fade-out',
  )}
  use:menu
  style="display: none;"
>
  <slot />
</div>
