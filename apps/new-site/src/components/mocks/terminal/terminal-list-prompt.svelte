<script lang="ts">
  import clsx from 'clsx';

  import CheckIcon from '~icons/lucide/check';

  import { createEventDispatcher, onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  import TerminalProcessList from './terminal-process-list.svelte';
  import type { TerminalProcessText } from './types';

  const dispatch = createEventDispatcher<{
    end: void;
  }>();

  export let options: string[];
  export let start = 0;
  export let select = 0;
  export let active = false;
  export let process: TerminalProcessText[] | undefined = undefined;

  let selected = start,
    hasSelected = false,
    hasProcessEnded = !process;

  onMount(() => {
    setTimeout(() => {
      next();
    }, 350);
  });

  function next() {
    setTimeout(() => {
      if (selected === select) {
        hasSelected = true;
        onEnd();
        return;
      }

      const direction = select < selected ? -1 : +1;
      selected += direction;
      next();
    }, 300);
  }

  function onProcessEnd() {
    hasProcessEnded = true;
    onEnd();
  }

  function onEnd() {
    if (!hasProcessEnded) return;
    dispatch('end');
  }
</script>

<div class={clsx(!active && 'opacity-75')} transition:fade>
  {#if hasSelected}
    <div class="flex items-center mt-1.5 ml-0.5">
      <CheckIcon class="text-green-400 mr-1 w-3 h-3" />
      <span class="text-white/90 text-xs font-mono">
        {options[selected]}
      </span>
    </div>
  {:else}
    <div class="mt-1 ml-0.5 text-sm text-white/90">
      {#each options as option, i}
        {@const isSelected = i === selected}
        <div class="flex items-center mt-0.5">
          <div
            class={clsx(
              'w-2.5 h-2.5 rounded-full border-2',
              isSelected ? 'border-green-400 bg-green-400' : 'border-border',
            )}
          />
          <span
            class={clsx('ml-2 font-mono text-xs', isSelected ? 'text-white/90' : 'text-white/40')}
          >
            {option}
          </span>
        </div>
      {/each}
    </div>
  {/if}

  {#if hasSelected && !!process}
    <TerminalProcessList lines={process} on:end={onProcessEnd} />
  {/if}
</div>
