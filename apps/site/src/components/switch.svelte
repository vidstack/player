<script lang="ts" context="module">
  export interface SwitchOption {
    label?: string;
    value: string;
    Icon: any;
    iconClass?: string | null | false;
  }
</script>

<script lang="ts">
  import clsx from 'clsx';

  import { createEventDispatcher, onMount } from 'svelte';
  import type { Writable } from 'svelte/store';

  import { createAriaRadioGroup } from '../aria/radio-group';

  export let label: string;
  export let defaultValue: string;
  export let value: Writable<string> | undefined = undefined;
  export let options: SwitchOption[];
  export let square = false;
  export let compact = false;

  let ready = false;
  onMount(() => {
    setTimeout(() => {
      ready = true;
    }, 200);
  });

  const dispatch = createEventDispatcher();

  const { radioGroup, radio, radioValue } = createAriaRadioGroup({
    defaultValue,
    onSelect(value) {
      dispatch('select', value);
    },
  });

  $: _value = $value || $radioValue;
  $: index = options.findIndex((o) => o.value === _value);
  $: optionSize = +((1 / options.length) * 100).toFixed(3);
</script>

<div
  class={clsx(
    'flex items-center relative overflow-hidden',
    !square && 'rounded-full',
    !compact && 'border border-border/90',
  )}
  use:radioGroup={label}
>
  {#each options as option}
    {@const label = option.label ?? option.value}
    <button
      class={clsx(
        'flex items-center outline-none hocus:bg-brand/10 focus-visible:border focus-visible:border-inverse',
        square ? !compact && 'rounded-sm' : 'rounded-full',
        compact ? 'px-2.5 py-[7px]' : 'px-3 py-2',
        ready && _value === option.value
          ? 'text-brand transition-colors'
          : 'text-soft/90 hocus:text-inverse',
      )}
      use:radio={option.value}
      aria-label={label}
    >
      <svelte:component this={option.Icon} class={clsx('w-4 h-4', option.iconClass)} />
    </button>
  {/each}

  <div
    class={clsx(
      'absolute top-0 left-0 bg-brand/20 h-8 duration-200 transition-[left,opacity] ease-out',
      !square && 'rounded-full',
      !ready ? 'opacity-0' : 'opacity-100',
      'pointer-events-none',
    )}
    style={`width: ${optionSize}%; left: ${index * optionSize}%;`}
  ></div>
</div>
