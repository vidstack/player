<script lang="ts">
  import AnimatedPanelIcon from '../../../icons/animated-panel-icon.svelte';
  import clsx from 'clsx';
  import { createAriaMenu } from '../../../aria/menu';
  import { IS_BROWSER } from '../../../utils/env';

  const OPEN_PREF_KEY = 'vidstack::editor-explorer-open';

  const userPrefersOpen =
    IS_BROWSER && localStorage[OPEN_PREF_KEY] && localStorage[OPEN_PREF_KEY] === 'true';
  const { menu, menuTrigger, isMenuOpen } = createAriaMenu({
    defaultOpen: userPrefersOpen ?? true,
    noPositioning: true,
    noOutSideClick: true,
  });

  $: if (IS_BROWSER) {
    localStorage[OPEN_PREF_KEY] = $isMenuOpen;
  }
</script>

<button
  type="button"
  class={clsx(
    'group flex transform-gpu items-center rounded-sm border-0 px-2 py-1 text-soft',
    'hocus:text-inverse hocus:bg-brand/10 fixed top-8 left-0 z-[60] transition-transform duration-300',
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
    'overflow-y-auto scrollbar duration-300 border-r border-border flex-1',
    'bg-elevate z-50 pt-9 px-1 min-w-[180px] max-w-[180px]',
    $isMenuOpen
      ? 'animate-in slide-in-from-left-full fade-in'
      : 'animate-out slide-out-to-left-full fade-out',
  )}
  use:menu
  style="display: none;"
>
  <slot />
</div>
