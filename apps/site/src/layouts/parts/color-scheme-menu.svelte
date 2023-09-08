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
  import clsx from 'clsx';

  import { offset } from '@floating-ui/dom';

  import { createAriaMenu } from '../../aria/menu';
  import { createAriaRadioGroup } from '../../aria/radio-group';
  import { createAriaTooltip } from '../../aria/tooltip';
  import { colorScheme, colorSchemes, isDarkColorScheme } from '../../stores/color-scheme';
  import { IS_BROWSER } from '../../utils/env';
  import { uppercaseFirstLetter } from '../../utils/string';

  const { tooltipTrigger, tooltipContent, isTooltipOpen } = createAriaTooltip({
    placement: 'bottom-end',
  });

  const { menuTrigger, menu, isMenuOpen } = createAriaMenu({
    placement: 'bottom-end',
    hover: true,
  });

  const { radioGroup, radio, radioValue } = createAriaRadioGroup({
    menu: true,
    defaultValue: $colorScheme,
  });

  $: $colorScheme = $radioValue;
  $: MenuTriggerIcon = IS_BROWSER ? ($isDarkColorScheme ? Icons.dark : Icons.light) : null;
</script>

<!-- Menu Trigger -->
<button
  {...$$restProps}
  class={clsx(
    'group relative flex transform-gpu items-center rounded-md p-2 min-w-[40px] min-h-[40px]',
    'border border-transparent hocus:bg-elevate hocus:border-border/90 transition-colors',
    'hocus:shadow-sm',
    $$restProps.class,
  )}
  use:menuTrigger
  use:tooltipTrigger
  aria-label="Color Scheme"
>
  <svelte:component this={MenuTriggerIcon} class="w-6 h-6" />
</button>

<!-- Menu -->
<div
  class={clsx(
    'p-2 border-border/90 border rounded-md bg-elevate hocus:ring-0 outline-none shadow-sm',
    $isMenuOpen
      ? 'animate-in slide-in-from-top-2 fade-in'
      : 'animate-out fade-out slide-out-to-top-2',
  )}
  style="display: none;"
  use:menu
>
  <div class="flex flex-col" use:radioGroup={'Color Scheme'}>
    {#each colorSchemes as scheme}
      <button
        class={clsx(
          'flex items-center px-4 py-2 rounded-sm text-sm outline-none hocus:bg-brand/10',
          $colorScheme === scheme ? 'text-brand' : 'text-soft/90 hocus:text-inverse',
        )}
        use:radio={scheme}
      >
        <svelte:component this={Icons[scheme]} class="mr-2" width={16} height={16} />
        {uppercaseFirstLetter(scheme)}
      </button>
    {/each}
  </div>
</div>

<div
  class={clsx(
    'z-10 rounded-md border border-border/90 bg-elevate text-xs font-medium px-1.5 py-1 shadow-sm',
    $isTooltipOpen
      ? 'animate-in fade-in slide-in-from-top-4'
      : 'animate-out fade-out slide-out-to-top-2',
    $isMenuOpen && 'hidden',
  )}
  style="display: none;"
  use:tooltipContent
>
  Theme
</div>
