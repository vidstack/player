<script lang="ts">
  import clsx from 'clsx';

  import ChevronDownIcon from '~icons/lucide/chevron-down';

  export let title: string;
</script>

<button
  {...$$restProps}
  class={clsx(
    'group relative flex transform-gpu items-center rounded-md border-0 p-2',
    'min-w-[40px] min-h-[40px] w-full nav-lg:w-auto text-base text-soft',
    'hocus:text-inverse aria-expanded:text-inverse',
    $$restProps.class,
  )}
  data-menu-trigger
>
  {title}
  <ChevronDownIcon
    class={clsx(
      'nav-lg:ml-[3px] ml-auto transition-transform w-5 h-5 nav-lg:w-4 nav-lg:h-4',
      'group-hocus:animate-pulse group-aria-expanded:rotate-180',
    )}
  />
</button>
