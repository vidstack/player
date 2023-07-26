<script lang="ts">
  import clsx from 'clsx';
  import { isDarkColorScheme } from '../../../../stores/color-scheme';
  import type { NavMenuItem } from '../navigation';

  export let title: NavMenuItem['badge'];
  export let invertColors = false;

  function getBadgeColor(title: NavMenuItem['badge'], darkTheme: boolean) {
    switch (title) {
      case '1.0':
        return clsx(
          'bg-blue-400/20',
          darkTheme ? 'text-blue-400 border-blue-400' : 'text-blue-600 border-blue-600',
        );
      case 'Beta':
        return clsx(
          'bg-green-400/20',
          darkTheme ? 'text-green-400 border-green-400' : 'text-green-600 border-green-600',
        );
      case 'Planned':
        return clsx(
          'bg-orange-400/20',
          darkTheme ? 'text-orange-400 border-orange-400' : 'text-orange-600 border-orange-600',
        );
      default:
        return clsx(
          'bg-indigo-400/20',
          darkTheme ? 'text-indigo-400 border-indigo-400' : 'text-indigo-600 border-indigo-600',
        );
    }
  }

  $: darkTheme = ($isDarkColorScheme && !invertColors) || (!$isDarkColorScheme && invertColors);
</script>

<div
  class={clsx(
    'px-1 rounded-sm text-[10px] nav-lg:text-xs nav-lg:py-px border ml-2',
    getBadgeColor(title, darkTheme),
  )}
>
  {title}
</div>
