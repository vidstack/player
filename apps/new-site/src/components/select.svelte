<script lang="ts">
  import { createSelect } from '@melt-ui/svelte';
  import type { FloatingConfig } from '@melt-ui/svelte/internal/actions';
  import Check from '~icons/lucide/check';
  import ChevronDown from '~icons/lucide/chevron-down';
  import clsx from 'clsx';

  function toValue(label: string) {
    return label.toString().replace(' ', '-');
  }

  export let title: string;
  export let options: string[] = [];
  export let disabled = false;
  export let arrowSize: number | undefined = undefined;
  export let positioning: FloatingConfig | undefined = undefined;

  const { trigger, menu, option, isSelected } = createSelect({
    disabled,
    positioning,
    arrowSize,
    loop: true,
  });
</script>

<button
  class={clsx(
    'relative flex min-w-[85px] items-center border dark:border-0 pl-2.5 pr-1',
    'bg-elevate transform-gpu transition-transform hover:scale-[1.025] rounded-md py-1',
    disabled
      ? 'text-soft/40'
      : 'text-soft hover:text-inverse focus-visible:text-inverse focus-visible:ring-2',
  )}
  {...$trigger}
  use:trigger
>
  {title}
  <ChevronDown />
</button>

<div
  class="z-10 flex max-h-[360px] flex-col overflow-y-auto rounded-md bg-body p-1 ring-0 border-border"
  {...$menu}
  use:menu
>
  {#each options as label}
    {@const value = toValue(label)}
    <div
      class={clsx(
        'relative cursor-pointer rounded-md py-1 pl-8 pr-4',
        'data-[highlighted]:bg-elevate data-[selected]:bg-brand data-[selected]:text-white text-inverse',
      )}
      {...$option({ value, label })}
    >
      {#if $isSelected(value)}
        <div class="absolute left-2 top-1/2 z-20 text-inverse translate-y-[calc(-50%+1px)]">
          <Check />
        </div>
      {/if}
      {label}
    </div>
  {/each}
</div>
