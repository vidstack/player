<script lang="ts">
  import clsx from 'clsx';

  let _class = '';
  export { _class as class };

  export let title = '';
  export let flat = false;
  export let style = '';
  export let showTopBar = false;
</script>

<div
  {...$$restProps}
  class={clsx(
    'code-block relative text-sm leading-[var(--leading)] flex flex-col min-h-0 bg-elevate',
    !flat
      ? 'shadow-xl rounded-md border-border border 576:max-h-[32rem] max-h-[60vh] mx-auto'
      : 'w-full min-h-full',
    _class,
  )}
  style={clsx(`--leading: 1.375rem;`, style)}
  data-flat={flat ? '' : null}
>
  {#if title || showTopBar}
    <div class="sticky top-0 z-10 flex items-center shrink-0 py-2.5 px-2 mb-1.5">
      {#if title}
        <span class="font-mono text-sm text-soft ml-1">{title}</span>
      {/if}
      <slot name="top-bar" />
    </div>
  {/if}

  <div
    class={clsx(
      'flex scrollbar scrollbar-square overflow-auto',
      !flat && (title || showTopBar ? 'px-2 pb-2.5' : 'p-4'),
    )}
  >
    <slot />
  </div>
</div>

<style>
  .code-block[data-flat] {
    max-height: calc(var(--code-block-max-h, 0px) - var(--code-block-gutters, 0px));
  }

  .code-block :global(pre code[data-lang-bash] span) {
    color: #fafafa !important;
  }

  .code-block :global(pre code[data-lang-bash] .line:not(:empty)::before) {
    content: '> ';
    font-weight: bold;
    color: rgb(var(--color-brand));
  }
</style>
