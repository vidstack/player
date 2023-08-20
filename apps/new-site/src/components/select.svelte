<script lang="ts">
  import clsx from 'clsx';

  import CheckIcon from '~icons/lucide/check';
  import ChevronDownIcon from '~icons/lucide/chevron-down';

  import { offset, type Placement } from '@floating-ui/dom';
  import { createEventDispatcher } from 'svelte';

  import { createSelect } from '../aria/select';

  const dispatch = createEventDispatcher<{
    change: string[];
  }>();

  export let label: string;
  export let options: { label: string; value: string }[];
  export let defaultValue: string | undefined = undefined;
  export let required = false;
  export let multiple = false;
  export let disabled = false;
  export let state: 'default' | 'readonly' | 'error' = 'default';
  export let placement: Placement = 'bottom';

  const { selectTrigger, selectMenu, selectOption, selectedValues, isSelectOpen } = createSelect({
    defaultValue,
    required,
    multiple,
    placement,
    middleware: [offset(6)],
    get disabled() {
      return disabled;
    },
  });

  $: dispatch('change', $selectedValues);
  $: selectionLabel = $selectedValues.map((v) => options.find(({ value }) => v === value)!.label);
  $: currentLabel = selectionLabel.join(', ') || label;
</script>

<button
  type="button"
  {...$$restProps}
  class={clsx(
    'relative flex items-center px-2.5 py-2',
    'rounded-sm shadow-sm max-w-full text-sm',
    state === 'error' ? 'border-2 border-red-600 dark:border-red-400' : 'border border-border',
    !disabled ? 'hocus:border-brand' : 'cursor-default',
    currentLabel === label ? 'text-soft' : 'text-inverse',
    $$restProps.class,
  )}
  use:selectTrigger={label}
>
  <span class="max-w-full truncate">
    {currentLabel}
  </span>

  <div class="flex-1"></div>
  <ChevronDownIcon class="w-5 h-5 shrink-0 ml-2" />

  <div
    class={clsx(
      'z-50 rounded-md border border-border bg-elevate text-xs p-2',
      'outline-none shadow-md absolute w-full',
      $isSelectOpen
        ? 'animate-in fade-in slide-in-from-top-4'
        : 'animate-out fade-out slide-out-to-top-2',
    )}
    use:selectMenu
  >
    {#if $isSelectOpen}
      {#each options as { label, value }}
        {@const isSelected = $selectedValues.includes(value)}
        <button
          type="button"
          class={clsx(
            'relative flex items-center pl-8 py-2 hocus:bg-brand/10 hocus:text-brand w-full text-sm',
            isSelected ? 'text-inverse' : 'text-soft',
          )}
          use:selectOption={value}
        >
          {#if isSelected}
            <CheckIcon class="w-4 h-4 absolute left-2 text-brand shrink-0" />
          {/if}
          {label}
        </button>
      {/each}
    {/if}
  </div>
</button>
