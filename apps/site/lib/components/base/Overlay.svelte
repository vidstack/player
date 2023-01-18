<script lang="ts">
  import clsx from 'clsx';

  export let open = false;
</script>

<div
  class={clsx(
    'pointer-events-auto fixed top-0 left-0 z-40 backdrop-blur-sm backdrop-filter transition-opacity duration-75',
    'bg-body/20 dark:bg-body/60',
    'h-screen w-screen',
    open ? 'visible opacity-100' : 'invisible opacity-0',
  )}
/>
