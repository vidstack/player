<script>
  import clsx from 'clsx';
  import BufferingIcon from './icons/BufferingIcon.svelte';
</script>

<div
  class={clsx(
    'media-buffering-container absolute inset-0 z-20 flex h-full w-full items-center',
    'pointer-events-none invisible justify-center opacity-0 transition-opacity duration-150 ease-out',
  )}
>
  <BufferingIcon />
</div>
