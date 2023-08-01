<script lang="ts" context="module">
  export type BadgeColor = 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'yellow';

  function getBadgeColor(color: BadgeColor, darkTheme: boolean) {
    switch (color) {
      case 'blue':
        return clsx(
          'bg-blue-400/20',
          darkTheme ? 'text-blue-400 border-blue-400' : 'text-blue-600 border-blue-600',
        );
      case 'green':
        return clsx(
          'bg-green-400/20',
          darkTheme ? 'text-green-400 border-green-400' : 'text-green-600 border-green-600',
        );
      case 'orange':
        return clsx(
          'bg-orange-400/20',
          darkTheme ? 'text-orange-400 border-orange-400' : 'text-orange-600 border-orange-600',
        );
      case 'purple':
        return clsx(
          'bg-indigo-400/20',
          darkTheme ? 'text-indigo-400 border-indigo-400' : 'text-indigo-600 border-indigo-600',
        );
      case 'red':
        return clsx(
          'bg-red-400/20',
          darkTheme ? 'text-red-400 border-red-400' : 'text-red-600 border-red-600',
        );
      case 'yellow':
        return clsx(
          'bg-yellow-400/20',
          darkTheme ? 'text-yellow-500 border-yellow-500' : 'text-yellow-600 border-yellow-600',
        );
    }
  }
</script>

<script lang="ts">
  import clsx from 'clsx';
  import { isDarkColorScheme } from '../stores/color-scheme';

  export let color: BadgeColor = 'purple';
  export let invertTheme = false;

  $: darkTheme = ($isDarkColorScheme && !invertTheme) || (!$isDarkColorScheme && invertTheme);
</script>

<div
  class={clsx(
    'px-1 rounded-sm text-[10px] nav-lg:text-xs nav-lg:py-px border ml-2 font-medium',
    getBadgeColor(color, darkTheme),
  )}
>
  <slot />
</div>
