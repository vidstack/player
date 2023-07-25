<script lang="ts">
  import clsx from 'clsx';
  import { createEventDispatcher } from 'svelte';
  import { isKeyboardClick } from '../utils/keyboard';
  import { isUndefined } from '../utils/unit';

  const dispatch = createEventDispatcher();

  export let primary = false;
  export let type: 'flat' | 'raised' = 'flat';
  export let arrow: 'left' | 'right' | undefined = undefined;
  export let as: 'button' | 'a' = 'button';

  let __class = '';
  export { __class as class };

  $: isButton = as === 'button' && isUndefined($$restProps['href']);

  $: buttonClass = clsx(
    'group transform-gpu text-[15px] font-medium transition-transform hover:scale-105',
    type === 'raised' && 'flex items-center justify-center',
    (isButton || type === 'raised') && 'rounded-md px-3 py-1.5',
    type === 'raised'
      ? primary
        ? 'bg-inverse text-body hover:bg-inverse/90'
        : 'bg-body border-2 border-inverse text-inverse'
      : 'text-soft hover:text-inverse',
    __class,
  );

  $: contentClass = clsx(
    'inline-block transform transition-transform duration-100 group-hover:translate-x-0',
    arrow === 'left' && '-translate-x-3',
    arrow === 'right' && 'translate-x-2',
  );

  $: arrowClass = clsx(
    arrow &&
      'opacity-0 transition-opacity duration-100 group-hover:visible group-hover:opacity-100',
    !arrow ? 'hidden' : 'inline-block',
  );
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<svelte:element
  this={as}
  class={buttonClass}
  {...$$restProps}
  on:pointerup={() => dispatch('press')}
  on:keydown={(e) => isKeyboardClick(e) && dispatch('press')}
>
  {#if arrow === 'left'}
    <span class={arrowClass} aria-hidden="true">&lt;-</span>
  {/if}

  <span class={contentClass}><slot /></span>

  {#if arrow === 'right'}
    <!-- svelte-ignore a11y-missing-attribute -->
    <span class={arrowClass} aria-hidden="true">-&gt;</span>
  {/if}
</svelte:element>
