<script lang="ts">
  import clsx from 'clsx';

  import ArrowDropDownIcon from '~icons/ri/arrow-drop-down-line';

  export let title: string;
  export let options: string[] = [];
  export let value: string = options[0];
  export let disabled = false;
  export let rounded = true;
  export let block = false;
  export let arrowWidth = 22;
  export let arrowHeight = 22;
</script>

<div class={clsx('inline-block', block && 'w-full')}>
  <label
    class={clsx(
      'relative flex items-center border pl-2.5 pr-1 shadow-sm min-w-[85px]',
      'transition-transform hover:scale-[1.025] transform-gpu hover:bg-gray-hover',
      rounded && 'rounded-md',
      block ? 'py-1' : 'py-0.5',
      disabled ? 'text-gray-300' : 'text-gray-inverse focus-within:ring-2',
    )}
    style="--tw-ring-color: var(--color-focus); border-color: var(--select-border-color, var(--color-gray-outline));"
  >
    <slot name="before-title" />

    <div class="flex items-center w-full">
      <span class="sr-only">{title}</span>

      <span
        class="flex h-full items-center mr-auto"
        style="font-size: var(--select-value-font-size, 0.875rem);"
      >
        {value}
      </span>

      <ArrowDropDownIcon
        width={arrowWidth}
        height={arrowHeight}
        class="mt-0.5 ml-[var(--select-arrow-margin-left,-1px)]"
      />
    </div>

    <select
      class="cursor-pointer opacity-0 inset-0 absolute appearance-none px-4 py-6"
      bind:value
      on:change
      {disabled}
    >
      {#each options as value (value)}
        <option {value}>{value}</option>
      {/each}
      <slot />
    </select>
  </label>
</div>
