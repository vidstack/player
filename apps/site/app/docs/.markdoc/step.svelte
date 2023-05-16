<script lang="ts">
  import clsx from 'clsx';
  import { tick } from 'svelte';

  import { getStepsContext } from './steps.svelte';

  const { register, steps } = getStepsContext();

  let index = register();

  export let orientation: 'horizontal' | 'vertical' = 'horizontal';

  let li: HTMLLIElement;
  $: if ($steps > 0 && li) {
    tick().then(() => {
      index = Array.from(li.parentElement!.children).indexOf(li) + 1;
    });
  }
</script>

<li
  class={clsx(
    'step 1200:grid relative pl-10 before:absolute before:content-[counter(step)]',
    'before:left-0 before:flex before:w-[calc(1.375rem+1px)] before:items-center before:justify-center',
    'before:h-[calc(1.375rem+1px)] before:text-[0.7rem] before:font-bold before:text-body',
    'before:bg before:bg-inverse before:rounded-md',
    'after:bg-border pb-2 after:absolute after:top-[calc(1.875rem+1px)] after:bottom-0 after:left-[0.6875rem] after:w-px',
    orientation === 'horizontal' ? 'grid-cols-5 gap-10' : 'grid-cols-4 gap-4',
    index === $steps && 'after:hidden',
  )}
  style="counter-increment: step;"
  bind:this={li}
>
  <div class={clsx('not-prose mt-0', orientation === 'horizontal' ? 'col-span-2' : 'col-span-4')}>
    <span class="text-inverse text-base font-semibold leading-7">
      <slot name="title" />
    </span>

    {#if $$slots.description}
      <div class="description mt-2 mb-6 text-sm">
        <slot name="description" />
      </div>
    {/if}
  </div>

  <div class={clsx(orientation === 'horizontal' ? 'col-span-3' : 'col-span-4')}>
    <slot />
  </div>
</li>
