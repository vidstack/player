<script lang="ts">
  import clsx from 'clsx';

  import XIcon from '~icons/lucide/x';

  import type { Action } from 'svelte/action';

  import { noop } from '../utils/unit';

  export let open = false;
  export let visible = false;
  export let stretch = false;
  export let action: Action = noop;
</script>

<div
  class={clsx(
    'fixed inset-0 w-screen h-screen bg-black/60 duration-300 backdrop-blur-[3px]',
    'flex items-center justify-center z-[9999]',
    open ? 'animate-in fade-in' : 'animate-out fade-out',
  )}
  style="display: none"
  use:action
>
  {#if visible}
    <div
      class={clsx(
        'flex flex-col w-[90%] h-[90%] max-h-[90%]',
        !stretch
          ? '576:w-auto 576:min-w-[450px] 576:max-w-[450px]'
          : '576:w-[50%] 576:max-w-[580px]',
        !stretch ? '576:h-auto 576:min-h-[450px] 576:max-h-[80%]' : '576:h-[75%]',
        'pointer-events-auto pb-8 border border-border bg-elevate outline-none',
        'transition rounded-md shadow-lg overflow-auto scrollbar',
      )}
      data-menu-root
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
        <slot />
      </div>
    </div>
  {/if}
</div>
