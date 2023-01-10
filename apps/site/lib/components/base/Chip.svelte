<script>
  import clsx from 'clsx';

  let __class = '';
  export { __class as class };
</script>

<div
  class={clsx(
    'inline-flex h-6 items-center justify-center px-2.5 py-1 font-mono text-xs font-medium tracking-wide',
    'border-divider border shadow-sm',
    __class,
  )}
  style="border-radius: var(--chip-border-radius, 9999px);"
>
  <span class="mt-px">
    <slot />
  </span>
</div>
