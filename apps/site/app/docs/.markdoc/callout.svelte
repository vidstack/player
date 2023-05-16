<script lang="ts">
  import clsx from 'clsx';
  import WarningIcon from '~icons/ri/error-warning-fill';
  import InfoIcon from '~icons/ri/information-fill';
  import TipIcon from '~icons/ri/lightbulb-flash-fill';
  import DangerIcon from '~icons/ri/skull-2-fill';
  import NoteIcon from '~icons/ri/sticky-note-fill';
  import ExperimentalIcon from '~icons/ri/test-tube-fill';

  export let title: string | null = null;
  export let type: 'note' | 'info' | 'tip' | 'warning' | 'danger' | 'experimental';

  const icons = {
    note: NoteIcon,
    info: InfoIcon,
    tip: TipIcon,
    warning: WarningIcon,
    danger: DangerIcon,
    experimental: ExperimentalIcon,
  };

  $: heading = title ?? type.toUpperCase();
</script>

<div
  class={clsx(
    'admonition bg-elevate my-8 mx-auto rounded-md border-2 border-l-8 p-4',
    type === 'note' && 'border-pink-600 dark:border-pink-400',
    type === 'info' && 'border-blue-600 dark:border-blue-400',
    type === 'tip' && 'border-green-600 dark:border-green-400',
    type === 'warning' && 'border-yellow-600 dark:border-yellow-400',
    type === 'danger' && 'border-red-600 dark:border-red-400',
    type === 'experimental' && 'border-indigo-600 dark:border-indigo-400',
  )}
>
  <div
    class={clsx(
      'flex h-full items-center font-bold',
      type === 'note' && 'text-pink-600 dark:text-pink-400',
      type === 'info' && 'text-blue-600 dark:text-blue-400',
      type === 'tip' && 'text-green-600 dark:text-green-400',
      type === 'warning' && 'text-yellow-600 dark:text-yellow-400',
      type === 'danger' && 'text-red-600 dark:text-red-400',
      type === 'experimental' && 'text-indigo-600 dark:text-indigo-400',
    )}
  >
    <svelte:component this={icons[type]} class="mr-1.5 text-lg" />
    <span class="flex items-center">
      {heading}
    </span>
  </div>

  <div class="text-inverse pl-1 text-base">
    <slot />
  </div>
</div>
