<script lang="ts">
  import clsx from 'clsx';

  import ArrowLeftIcon from '~icons/lucide/arrow-left';
  import ArrowRightIcon from '~icons/lucide/arrow-right';

  import { createEventDispatcher } from 'svelte';
  import type { Action } from 'svelte/action';

  import { isKeyboardPress } from '../utils/keyboard';
  import { isUndefined, noop } from '../utils/unit';
  import GradientBorder from './gradient-border.svelte';

  const dispatch = createEventDispatcher();

  export let primary = false;
  export let flat = false;
  export let gradient: string | boolean | undefined = undefined;
  export let arrow: boolean | 'left' | 'right' | undefined = undefined;
  export let action: Action<any, any> = noop;

  $: isButton = isUndefined($$restProps['href']);

  $: buttonClass = clsx(
    'flex items-center rounded-md font-medium group px-5 py-2.5 1200:py-3 text-sm',
    '768:px-6 768:text-base outline-none',
    !flat && 'shadow-sm',
    primary ? 'bg-inverse' : !flat && 'bg-elevate',
    gradient && 'bg-clip-padding border-2 border-transparent',
    !gradient && !flat && 'border-2 border-border/90',
    $$restProps.class,
  );

  $: hasRightArrow = arrow === true || arrow === 'right';

  $: arrowClass = clsx(
    'w-0 h-4 group-hocus:w-4 transition-[width]',
    hasRightArrow ? 'group-hocus:ml-0.5' : 'group-hocus:mr-0.5',
  );
</script>

<div class="relative z-[1]" style={clsx(typeof gradient === 'string' && gradient)}>
  {#if gradient}
    <GradientBorder class="rounded-md" />
  {/if}

  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <svelte:element
    this={isButton ? 'button' : 'a'}
    {...$$restProps}
    class={buttonClass}
    use:action={action}
    on:pointerup={() => dispatch('press')}
    on:keydown={(e) => isKeyboardPress(e) && dispatch('press')}
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
