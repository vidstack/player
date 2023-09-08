<script lang="ts" context="module">
  export type BadgeColor = 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'yellow';

  function getBadgeColor(color: BadgeColor) {
    switch (color) {
      case 'blue':
        return clsx(
          'bg-blue-400/10 text-blue-700 border-blue-600/20',
          'dark:text-blue-400 dark:border-blue-400/20',
        );
      case 'green':
        return clsx(
          'bg-green-400/10 text-green-700 border-green-600/20',
          'dark:text-green-400 dark:border-green-400/20',
        );
      case 'orange':
        return clsx(
          'bg-orange-400/10 text-orange-700 border-orange-600/20',
          'dark:text-orange-400 dark:border-orange-400/20',
        );
      case 'purple':
        return clsx(
          'bg-indigo-400/10 text-indigo-700 border-indigo-600/20',
          'dark:text-indigo-400 dark:border-indigo-400/20',
        );
      case 'red':
        return clsx(
          'bg-red-400/10 text-red-700 border-red-600/20',
          'dark:text-red-400 dark:border-red-400/20',
        );
      case 'yellow':
        return clsx(
          'bg-yellow-400/10 text-yellow-700 border-yellow-600/20',
          'dark:text-yellow-500 dark:border-yellow-500/20',
        );
    }
  }
</script>

<script lang="ts">
  import clsx from 'clsx';

  export let color: BadgeColor = 'purple';

  let _class: string | undefined = undefined;
  export { _class as class };
</script>

<div
  class={clsx(
    'px-1 rounded-sm text-[10px] leading-5 border font-medium',
    getBadgeColor(color),
    _class,
  )}
>
  <slot />
</div>
