<script lang="ts">
  import { isUndefined } from '@vidstack/foundation';

  import clsx from 'clsx';

  export let type: 'flat' | 'raised' = 'flat';
  export let arrow: 'left' | 'right' | null = null;

  let __as: 'button' | 'a' = 'button';
  export { __as as as };

  let __class = '';
  export { __class as class };

  $: isButton = __as === 'button' && isUndefined($$restProps['href']);

  $: buttonClass = clsx(
    'group transform-gpu text-lg font-medium transition-transform hover:scale-105',
    type === 'raised' &&
      'bg-gray-inverse text-gray-current hover:bg-gray-hover-inverse shadow-md hover:shadow-xl px-8 py-3',
    (isButton || type === 'raised') && 'rounded-md',
    __class,
  );

  $: contentClass = clsx(
    'inline-block transform transition-transform duration-100 group-hover:translate-x-0',
    arrow === 'left' && '-translate-x-3 ',
    arrow === 'right' && 'translate-x-2',
  );

  $: arrowClass = clsx(
    arrow &&
      'opacity-0 transition-opacity duration-100 group-hover:visible group-hover:opacity-100',
    !arrow ? 'hidden' : 'inline-block',
  );
</script>

{#if isButton}
  <button class={buttonClass} {...$$restProps}>
    {#if arrow === 'left'}
      <span class={arrowClass}>&lt;-</span>
    {/if}
    <span class={contentClass}><slot /></span>
    {#if arrow === 'right'}
      <span class={arrowClass}>-></span>
    {/if}
  </button>
{:else}
  <!-- svelte-ignore a11y-missing-attribute -->
  <a class={buttonClass} {...$$restProps}>
    {#if arrow === 'left'}
      <span class={arrowClass}>&lt;-</span>
    {/if}
    <span class={contentClass}><slot /></span>
    {#if arrow === 'right'}
      <span class={arrowClass}>-></span>
    {/if}
  </a>
{/if}
