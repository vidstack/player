<script lang="ts">
  import clsx from 'clsx';

  export let open = false;
</script>

<div
  class={clsx(
    'bg-[rgb(255 248 238 / 0.4)] pointer-events-auto fixed top-0 left-0 z-40 bg-gray-700/40 backdrop-blur-sm backdrop-filter transition-opacity duration-75',
    'h-screen w-screen',
    open ? 'visible opacity-100' : 'invisible opacity-0',
  )}
/>
