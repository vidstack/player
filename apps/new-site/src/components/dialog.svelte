<script lang="ts">
  import clsx from 'clsx';

  import XIcon from '~icons/lucide/x';

  import { createAriaMenu } from '../aria/menu';
  import Button from './button.svelte';

  const { menu, menuTrigger, isMenuOpen, closeMenu } = createAriaMenu({
    portal: true,
    noPlacement: true,
    preventScroll: true,
    selectors: {
      close: ['[data-close]'],
    },
  });
</script>

<Button action={menuTrigger} {...$$restProps}>
  <slot name="trigger" />
</Button>

<!-- Menu -->
<div
  class={clsx(
    'fixed inset-0 w-screen h-screen bg-black/40 duration-300 backdrop-blur-[3px]',
    'flex items-center justify-center z-[9999]',
    $isMenuOpen ? 'animate-in fade-in' : 'animate-out fade-out',
  )}
  use:menu
  style="display: none"
  on:pointerup={closeMenu}
>
  {#if $isMenuOpen}
    <div
      class={clsx(
        'flex flex-col w-[90%] h-[90%] max-h-[90%]',
        '576:w-auto 576:min-w-[450px] 576:max-w-[450px]',
        '576:h-auto 576:min-h-[450px] 576:max-h-[100%]',
        'pointer-events-auto pb-8 border border-border bg-elevate outline-none',
        'transition rounded-md shadow-lg',
      )}
      on:pointerup|stopPropagation
      data-root
    >
      <div class="flex w-full items-center">
        <div class="flex-1"></div>
        <button
          class="p-3 mt-0.5 mr-0.5 rounded-md hocus:text-inverse/80"
          aria-label="Close Dialog"
          data-close
        >
          <XIcon />
        </button>
      </div>
      <div class="w-full h-full">
        <slot name="content" isMenuOpen={$isMenuOpen} />
      </div>
    </div>
  {/if}
</div>
