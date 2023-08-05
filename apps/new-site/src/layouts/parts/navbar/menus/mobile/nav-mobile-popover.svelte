<script lang="ts">
  import clsx from 'clsx';
  import { createAriaMenu } from '../../../../../aria/menu';
  import AnimatedMenuIcon from '../../../../../icons/animated-menu-icon.svelte';
  import { scrollTop } from '../../../../../stores/scroll';
  import ColorSchemeSwitch from '../../../color-scheme-switch.svelte';
  import NavMobileItems from './nav-mobile-items.svelte';

  export let announcementBar = false;

  const { menu, menuTrigger, isMenuOpen } = createAriaMenu({
    placement: 'bottom-start',
    portal: true,
    preventScroll: true,
  });
</script>

<button
  type="button"
  class={clsx(
    'group relative flex transform-gpu items-center rounded-md border-0 px-1 py-0.5',
    'transition-transform hover:scale-105 hocus:bg-brand/10 nav-lg:hidden',
  )}
  aria-label="Open Site Menu"
  use:menuTrigger
>
  <AnimatedMenuIcon open={$isMenuOpen} />
</button>

<div
  class={clsx(
    'fixed overflow-y-scroll left-0 w-screen scrollbar transition-[top,height] duration-300',
    'bg-body z-50 top-[var(--top)] pt-4 pb-8 nav-lg:hidden',
    $isMenuOpen ? 'animate-in fade-in h-[calc(100vh-var(--top))]' : 'animate-out fade-out h-0',
  )}
  use:menu
  style="display: none;"
  style:--top={$scrollTop === 0 && announcementBar
    ? 'var(--top-bar-height)'
    : 'var(--navbar-height)'}
>
  <NavMobileItems />
  <div class="mt-2 px-4 flex items-start">
    <ColorSchemeSwitch />
  </div>
</div>
