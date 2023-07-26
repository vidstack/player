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
  import { createAriaRadioGroup } from '../../aria/radio-group';
  import { colorScheme, colorSchemes } from '../../stores/color-scheme';

  const { radioGroup, radio, radioValue } = createAriaRadioGroup({
    defaultValue: $colorScheme,
  });

  $: $colorScheme = $radioValue;
  $: index = colorSchemes.indexOf($colorScheme);
</script>

<div
  class="flex items-center relative border border-border rounded-full"
  use:radioGroup={'Color Scheme'}
>
  {#each colorSchemes as scheme}
    <button
      class={clsx(
        'flex items-center px-3 py-2 outline-none hocus:bg-brand/10 rounded-full focus-visible:border focus-visible:border-inverse',
        $colorScheme === scheme && 'text-brand',
      )}
      use:radio={scheme}
      aria-label={scheme}
    >
      <svelte:component this={Icons[scheme]} class="w-4 h-4" />
    </button>
  {/each}

  <div
    class={clsx(
      'absolute top-0 left-0 bg-brand/20 rounded-full w-[33.3%] h-8 duration-300 transition-[left] ease-out',
      'pointer-events-none',
    )}
    style={`left: ${index * 33.3}%;`}
  ></div>
</div>
