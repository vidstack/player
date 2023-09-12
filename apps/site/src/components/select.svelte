<script lang="ts" context="module">
  export interface Option {
    label: string;
    value: string;
    group?: string;
  }
</script>

<script lang="ts">
  import clsx from 'clsx';

  import CheckIcon from '~icons/lucide/check';
  import ChevronDownIcon from '~icons/lucide/chevron-down';

  import { visible } from '~/actions/visible';
  import { isString } from '~/utils/unit';
  import { createEventDispatcher } from 'svelte';

  import { createSelect } from '../aria/select';

  const dispatch = createEventDispatcher<{
    select: string[];
    change: string[];
  }>();

  export let label: string;
  export let value: string | string[] | undefined = undefined;
  export let options: Option[];
  export let defaultValue: string | string[] | undefined = undefined;
  export let required = false;
  export let multiple = false;
  export let disabled = false;
  export let state: 'default' | 'readonly' | 'error' = 'default';

  const { selectTrigger, selectMenu, selectOption, selectedValues, isSelectOpen, isSelectVisible } =
    createSelect({
      defaultValue: defaultValue ?? value,
      required,
      multiple,
      get disabled() {
        return disabled;
      },
    });

  $: if (value) {
    selectedValues.set(isString(value) ? [value] : value);
  }

  $: dispatch('select', $selectedValues);
  $: if (!$isSelectOpen) dispatch('change', $selectedValues);

  $: selectionLabel = $selectedValues
    .map((v) => options.find(({ value }) => v === value)?.label)
    .filter(Boolean) as string[];

  $: currentLabel = selectionLabel.join(', ') || label;

  // Sort into groups.
  $: groups = options.reduce(
    (p, option) => ({ ...p, [option.group || '']: [...(p[option.group || ''] || []), option] }),
    {} as Record<string, Option[]>,
  );
</script>

<button
  type="button"
  {...$$restProps}
  class={clsx(
    'relative flex items-center px-2.5 py-2',
    'rounded-sm shadow-sm max-w-full text-sm',
    state === 'error' ? 'border-2 border-red-600 dark:border-red-400' : 'border border-border/90',
    !disabled ? 'hocus:border-brand/90 hocus:bg-elevate' : 'cursor-default',
    currentLabel === label ? 'text-soft' : 'text-inverse',
    $$restProps.class,
  )}
  use:selectTrigger={label}
>
  <span
    class="flex items-center max-w-full truncate opacity-0 data-[visible]:opacity-100 transition-opacity"
    use:visible
  >
    <slot name="icon" />
    {currentLabel}
  </span>

  <div class="flex-1"></div>
  <ChevronDownIcon class="w-5 h-5 shrink-0 ml-2" />
</button>

<div
  class={clsx(
    'z-50 rounded-md border border-border/90 bg-elevate text-xs p-2',
    'outline-none shadow-md fixed',
    $isSelectOpen
      ? 'animate-in fade-in slide-in-from-top-4'
      : 'animate-out fade-out slide-out-to-top-2',
  )}
  use:selectMenu
  style="display: none;"
>
  {#if $isSelectVisible}
    {#each Object.keys(groups) as group}
      <svelte:element this={group ? 'section' : 'div'} class="flex flex-col pt-2.5">
        {#if group}
          <h1 class="text-xs font-medium text-soft mb-2 ml-0.5">{group}</h1>
        {/if}

        {#each groups[group] as { label, value }}
          {@const isSelected = $selectedValues.includes(value)}
          <button
            type="button"
            class={clsx(
              'relative flex items-center pl-8 py-2 w-full text-sm',
              isSelected ? 'text-inverse' : 'text-soft hocus:bg-brand/10 hocus:text-inverse ',
            )}
            data-group={group}
            use:selectOption={value}
          >
            {#if isSelected}
              <CheckIcon class="w-4 h-4 absolute left-2 text-brand shrink-0" />
            {/if}
            {label}
          </button>
        {/each}
      </svelte:element>
    {/each}
  {/if}
</div>
