<script lang="ts">
  import clsx from 'clsx';
  import { createAriaMenu } from '../../../../../aria/menu';
  import AnimatedMenuIcon from '../animated-menu-icon.svelte';

  const { menu, menuTrigger, isMenuOpen } = createAriaMenu({
    placement: 'bottom-start',
    noPositioning: true,
  });
</script>

<button
  type="button"
  class={clsx(
    'group relative flex transform-gpu items-center rounded-md border-0 px-1 py-0.5',
    'transition-transform hover:scale-105 hover:bg-elevate',
  )}
  aria-label="Open Site Menu"
  use:menuTrigger
>
  <AnimatedMenuIcon open={$isMenuOpen} />
</button>

<div
  class={clsx(
    'fixed overflow-y-scroll main-top-offset left-0 right-0 h-[calc(100%-var(--navbar-height))] scrollbar',
    'bg-body z-50',
    $isMenuOpen
      ? 'slide-in-from-top-2 animate-in fade-in'
      : 'animate-out slide-out-to-top-2 fade-out',
  )}
  use:menu
  style="display: none;"
>
  <slot />
</div>
