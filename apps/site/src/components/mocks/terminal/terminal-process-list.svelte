<script lang="ts">
  import CheckIcon from '~icons/lucide/check';
  import ComputerIcon from '~icons/lucide/computer';

  import { createEventDispatcher, onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  import { isString } from '../../../utils/unit';
  import ProgressCircle from '../../progress-circle.svelte';
  import type { TerminalProcessText } from './types';

  const dispatch = createEventDispatcher<{ end: void }>();

  export let lines: TerminalProcessText[];

  let activeLine = -1,
    loadedPercent = 0;

  onMount(nextLine);

  function load(duration: number) {
    loadedPercent = 0;
    const increment = (1 / duration) * 100,
      id = window.setInterval(() => {
        loadedPercent += increment;
        if (loadedPercent >= 100) {
          loadedPercent = 100;
          window.clearInterval(id);
          setTimeout(nextLine, 200);
        }
      }, 1);
  }

  function nextLine() {
    if (activeLine === lines.length) {
      dispatch('end');
      return;
    }

    setTimeout(() => {
      activeLine++;

      const line = lines[activeLine];
      if (line && !isString(line) && line.type === 'progress') {
        load(line.duration);
        return;
      }

      nextLine();
    }, 300);
  }
</script>

<div class="my-1.5 ml-1 font-mono text-xs text-white/90">
  {#each lines as text, i}
    {#if i <= activeLine}
      <div class="flex items-center mt-1 tracking-tight whitespace-nowrap" transition:fade>
        {#if isString(text)}
          <ComputerIcon class="w-3 h-3 text-white/30 mr-2 shrink-0" />
          {text}
        {:else if text.type === 'progress'}
          {#if activeLine > i || loadedPercent === 100}
            <CheckIcon class="text-green-400 mr-1 w-3 h-3 shrink-0" />
          {:else}
            <ProgressCircle
              class="mr-2 shrink-0"
              trackClass="opacity-25"
              fillClass="text-white/90"
              size={16}
              percent={loadedPercent}
            />
          {/if}

          {text.text(loadedPercent)}
        {:else if text.type === 'diff-pos'}
          <div class="text-green-400 ml-1">- {text.text}</div>
        {:else if text.type === 'diff-neg'}
          <div class="text-red-400 ml-1">- {text.text}</div>
        {/if}
      </div>
    {/if}
  {/each}
</div>
