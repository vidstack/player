<script lang="ts">
  import clsx from 'clsx';

  let _class = '';
  export { _class as class };
</script>

<span
  class={clsx(
    'text-gradient z-[-2] absolute w-full h-full inset-0',
    'before:w-full before:h-full before:absolute before:bg-clip-padding',
    'before:blur-[36px] before:z-[-1] before:inset-0 before:border-[13px] before:border-transparent',
    _class,
  )}
></span>

<style>
  .text-gradient {
    --bg-image: linear-gradient(165deg, var(--from-color), var(--to-color));
    background-image: var(--bg-image);
  }

  .text-gradient:before {
    content: ' ';
    background-image: var(--bg-image);
  }
</style>
