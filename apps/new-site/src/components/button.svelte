<script lang="ts">
  import ArrowLeftIcon from '~icons/lucide/arrow-left';
  import ArrowRightIcon from '~icons/lucide/arrow-right';
  import clsx from 'clsx';
  import { createEventDispatcher } from 'svelte';
  import { isKeyboardClick } from '../utils/keyboard';
  import { isUndefined } from '../utils/unit';

  const dispatch = createEventDispatcher();

  export let primary = false;
  export let gradient: string | boolean | undefined = undefined;
  export let arrow: boolean | 'left' | 'right' | undefined = undefined;

  $: isButton = isUndefined($$restProps['href']);

  $: buttonClass = clsx(
    'flex items-center rounded-md font-medium group px-5 py-2.5 text-sm',
    '768:px-6 768:text-base',
    primary ? 'bg-inverse' : 'bg-body',
    gradient && 'bg-clip-padding border-2 border-transparent',
    !gradient && 'border-2 border-border',
    $$restProps.class,
  );

  $: hasRightArrow = arrow === true || arrow === 'right';

  $: arrowClass = clsx(
    'w-0 h-4 group-hocus:w-4 transition-[width]',
    hasRightArrow ? 'group-hocus:ml-0.5' : 'group-hocus:mr-0.5',
  );
</script>

<div class="relative" style={clsx(typeof gradient === 'string' && gradient)}>
  {#if gradient}
    <span
      class={clsx(
        'text-gradient rounded-md z-[-2] absolute w-full h-full inset-0',
        'before:w-full before:h-full before:absolute before:bg-clip-padding',
        'before:blur-[36px] before:z-[-1] before:inset-0 before:border-[13px] before:border-transparent',
      )}
    ></span>
  {/if}

  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <svelte:element
    this={isButton ? 'button' : 'a'}
    {...$$restProps}
    class={buttonClass}
    on:pointerup={() => dispatch('press')}
    on:keydown={(e) => isKeyboardClick(e) && dispatch('press')}
  >
    {#if arrow === 'left'}
      <ArrowLeftIcon class={arrowClass} />
    {/if}

    <slot />

    {#if hasRightArrow}
      <ArrowRightIcon class={arrowClass} />
    {/if}
  </svelte:element>
</div>

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
