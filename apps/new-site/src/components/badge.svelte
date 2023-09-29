<script lang="ts" context="module">
  export type BadgeColor = 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'yellow';

  function getBadgeColor(color: BadgeColor) {
    switch (color) {
      case 'blue':
        return clsx(
          'bg-blue-400/20 text-blue-600 border-blue-600',
          'dark:text-blue-400 dark:border-blue-400',
        );
      case 'green':
        return clsx(
          'bg-green-400/20 text-green-600 border-green-600',
          'dark:text-green-400 dark:border-green-400',
        );
      case 'orange':
        return clsx(
          'bg-orange-400/20 text-orange-600 border-orange-600',
          'dark:text-orange-400 dark:border-orange-400',
        );
      case 'purple':
        return clsx(
          'bg-indigo-400/20 text-indigo-600 border-indigo-600',
          'dark:text-indigo-400 dark:border-indigo-400',
        );
      case 'red':
        return clsx(
          'bg-red-400/20 text-red-600 border-red-600',
          'dark:text-red-400 dark:border-red-400',
        );
      case 'yellow':
        return clsx(
          'bg-yellow-400/20 text-yellow-600 border-yellow-600',
          'dark:text-yellow-500 dark:border-yellow-500',
        );
    }
  }
</script>

<script lang="ts">
  import clsx from 'clsx';

  export let color: BadgeColor = 'purple';
</script>

<div
  class={clsx(
    'px-1 rounded-sm text-[10px] nav-lg:text-xs nav-lg:py-px border ml-2 font-medium',
    getBadgeColor(color),
  )}
>
  <slot />
</div>
