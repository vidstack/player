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
      'relative flex min-w-[85px] items-center border dark:border-0 pl-2.5 pr-1',
      'bg-elevate transform-gpu transition-transform hover:scale-[1.025]',
      rounded && 'rounded-md',
      block ? 'py-1' : 'py-0.5',
      disabled
        ? 'text-soft/40'
        : 'text-soft hover:text-inverse focus-within:text-inverse focus-within:ring-2',
    )}
    style="--tw-ring-color: rgb(var(--color-focus)); border-color: var(--select-border-color, rgb(var(--color-border)));"
  >
    <slot name="before-title" />

    <div class="flex w-full items-center">
      <span class="sr-only">{title}</span>

      <span
        class="mr-auto flex h-full items-center"
        style="font-size: var(--select-value-font-size, 0.8rem);"
      >
        {value}
      </span>

      <ArrowDropDownIcon
        width={arrowWidth}
        height={arrowHeight}
        class="pointer-events-none mt-0.5 ml-[var(--select-arrow-margin-left,-1px)]"
      />
    </div>

    <select
      class="absolute inset-0 cursor-pointer appearance-none px-4 py-6 opacity-0"
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
