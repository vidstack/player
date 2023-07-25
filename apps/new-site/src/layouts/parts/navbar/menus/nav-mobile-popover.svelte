<script lang="ts">
  import clsx from 'clsx';
  import AnimatedMenuIcon from './animated-menu-icon.svelte';

  let isOpen = false;
</script>

<button
  type="button"
  class={clsx(
    'group relative flex transform-gpu items-center rounded-md border-0 px-1 py-0.5',
    'transition-transform hover:scale-105 hover:bg-elevate',
  )}
  aria-label="Open Site Menu"
  aria-controls="mobile-main-menu"
  aria-expanded={isOpen}
  aria-haspopup="menu"
>
  <AnimatedMenuIcon open={isOpen} />
</button>

<div
  id="mobile-main-menu"
  role="menu"
  class={clsx(
    'fixed overflow-x-hidden top-[var(--navbar-height)] left-0 right-0 h-[calc(100%-var(--navbar-height))]',
    'bg-body z-50',
    !isOpen && 'hidden',
  )}
  aria-hidden={!isOpen}
>
  <div class="flex flex-col">
    Apples
    <!--  -->
  </div>
</div>
