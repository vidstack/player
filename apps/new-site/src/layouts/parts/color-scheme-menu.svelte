<script context="module">
  import SystemIcon from '~icons/lucide/monitor';
  import MoonIcon from '~icons/lucide/moon-star';
  import SunIcon from '~icons/lucide/sun';

  const Icons = {
    light: SunIcon,
    dark: MoonIcon,
    system: SystemIcon,
  };
</script>

<script lang="ts">
  import { createDropdownMenu, createTooltip } from '@melt-ui/svelte';
  import clsx from 'clsx';
  import { fade } from 'svelte/transition';
  import { colorScheme, colorSchemes, isDarkColorScheme } from '../../stores/color-scheme';
  import { IS_BROWSER } from '../../utils/env';
  import { uppercaseFirstLetter } from '../../utils/string';

  const {
    trigger: tooltipTrigger,
    content: tooltipContent,
    open: isTooltipOpen,
  } = createTooltip({
    positioning: { placement: 'bottom' },
    openDelay: 300,
    closeDelay: 0,
    arrowSize: 8,
  });

  const {
    menu,
    open: isMenuOpen,
    trigger: menuTrigger,
    createMenuRadioGroup,
  } = createDropdownMenu({ loop: true, preventScroll: false });

  const { radioGroup, radioItem } = createMenuRadioGroup({
    value: $colorScheme,
  });

  $: MenuTriggerIcon = IS_BROWSER ? ($isDarkColorScheme ? Icons.dark : Icons.light) : null;
</script>

<!-- Menu Trigger -->
<button
  {...$$restProps}
  class={clsx(
    'group relative flex transform-gpu items-center rounded-md border-0 p-2 min-w-[40px] min-h-[40px]',
    'transition-transform hover:scale-105 hover:bg-elevate',
    $$restProps.class,
  )}
  {...$menuTrigger}
  use:menuTrigger
  {...$tooltipTrigger}
  use:tooltipTrigger
  aria-label="Color Scheme"
>
  <svelte:component this={MenuTriggerIcon} width={24} height={24} />
</button>

<!-- Menu -->
<div
  class="p-2 border-border border rounded-sm bg-body hocus:ring-0 outline-none"
  {...$menu}
  use:menu
>
  <div class="flex flex-col" {...$radioGroup} use:radioGroup aria-label="Color Schemes">
    {#each colorSchemes as scheme}
      <button
        class={clsx(
          'flex items-center px-4 py-2 rounded-sm text-sm hocus:bg-elevate outline-none',
          $colorScheme === scheme && 'text-brand',
        )}
        {...$radioItem({ value: scheme })}
        use:radioItem={{
          onSelect() {
            $colorScheme = scheme;
          },
        }}
      >
        <svelte:component this={Icons[scheme]} class="mr-2" width={16} height={16} />
        {uppercaseFirstLetter(scheme)}
      </button>
    {/each}
  </div>
</div>

{#if $isTooltipOpen && !$isMenuOpen}
  <div
    transition:fade={{ duration: 100 }}
    class="z-10 rounded-sm border border-border bg-body text-xs font-medium px-1.5 py-1"
    {...$tooltipContent}
    use:tooltipContent
  >
    Theme
  </div>
{/if}
