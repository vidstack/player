<script lang="ts">
  import clsx from 'clsx';

  import TerminalIcon from '~icons/lucide/terminal';

  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  import { isNumber } from '../../../utils/unit';
  import ProgressCircle from '../../progress-circle.svelte';
  import TypeWriter from '../../style/type-writer.svelte';
  import TerminalDirInfo from './terminal-dir-info.svelte';
  import TerminalProcessList from './terminal-process-list.svelte';
  import type { TerminalProcessText } from './types';

  const dispatch = createEventDispatcher<{
    end: void;
  }>();

  export let text: string;
  export let delay = 0;
  export let active: boolean;
  export let loadDuration: number | undefined = undefined;
  export let loadedText: string | undefined = undefined;
  export let process: TerminalProcessText[] | undefined = undefined;

  let hasInputEnded = false,
    hasProcessEnded = !process,
    loadedPercent = 0,
    hasFinishedLoading = !isNumber(loadDuration);

  function onInputEnd() {
    hasInputEnded = true;
    onLoad();
    onEnd();
  }

  function onProcessEnd() {
    hasProcessEnded = true;
    onEnd();
  }

  function onLoad() {
    if (!isNumber(loadDuration)) return;

    const increment = (1 / loadDuration) * 100,
      id = window.setInterval(() => {
        if (!isNumber(loadDuration)) return;
        loadedPercent += increment;
        if (loadedPercent >= 100) {
          window.clearInterval(id);
          setTimeout(() => {
            hasFinishedLoading = true;
            onEnd();
          }, 200);
        }
      }, 1);
  }

  function onEnd() {
    if (!hasProcessEnded || !hasFinishedLoading) return;
    dispatch('end');
  }
</script>

<div class={clsx(!active && 'opacity-75')} transition:fade>
  <div class="flex items-center text-sm mt-1 ml-0.5 font-mono whitespace-nowrap">
    {#if hasInputEnded && isNumber(loadDuration) && !hasFinishedLoading}
      <ProgressCircle
        class="mr-2 shrink-0"
        trackClass="opacity-25"
        fillClass="text-white/90"
        size={16}
        percent={loadedPercent}
      />
    {:else}
      <TerminalIcon class="w-4 h-4 mr-2 text-white/30 shrink-0" />
    {/if}

    <TerminalDirInfo />

    <span class="text-white/90">
      {#if isNumber(loadDuration) && hasFinishedLoading && loadedText}
        {loadedText}
      {:else}
        <TypeWriter class="tracking-tight" {text} {delay} on:end={onInputEnd} />
      {/if}
    </span>

    {#if active && !hasInputEnded}
      <!-- Caret -->
      <span class="w-2 h-full bg-white/70 ml-px"></span>
    {/if}
  </div>

  {#if hasInputEnded && hasFinishedLoading && !!process}
    <TerminalProcessList lines={process} on:end={onProcessEnd} />
  {/if}
</div>
