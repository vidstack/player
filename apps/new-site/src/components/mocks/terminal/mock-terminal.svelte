<script lang="ts">
  import { onMount } from 'svelte';

  import { isString } from '../../../utils/unit';
  import MockWindowBar from '../mock-window-bar.svelte';
  import { setTerminalContext } from './context';
  import TerminalLine from './terminal-line.svelte';
  import TerminalListPrompt from './terminal-list-prompt.svelte';
  import { TerminalCommand, TerminalPromptType, type TerminalPrompt } from './types';

  export let directory: string;
  export let branch = 'main';
  export let delay = 0;
  export let prompts: TerminalPrompt[];

  setTerminalContext({
    directory,
    branch,
  });

  let terminalWindow: HTMLElement,
    activePrompt = -1;

  onMount(() => {
    activePrompt = 0;
  });

  function nextPrompt() {
    if (activePrompt === prompts.length - 1) return;
    setTimeout(() => {
      activePrompt += 1;
      terminalWindow.scrollTo({
        top: terminalWindow.offsetHeight / 2,
        behavior: 'smooth',
      });
    }, 200);
  }

  $: if (prompts[activePrompt] === TerminalCommand.Clear) {
    setTimeout(() => {
      prompts = prompts.slice(activePrompt);
      nextPrompt();
    }, 200);
  }
</script>

<section
  class="w-full border border-border flex flex-col flex-1 h-[500px] rounded-md shadow-md 1200:shadow-lg bg-elevate prefers-dark-scheme"
  aria-label="Mock Terminal"
>
  <MockWindowBar />

  <div class="flex-1 flex flex-col p-2" bind:this={terminalWindow}>
    <!-- Process -->
    <div class="text-[10px] text-white/50 mb-2">projects/{directory} (~zsh)</div>

    <div class="flex-1 basis-0 overflow-auto scrollbar scrollbar-square">
      <!-- Line -->
      {#each prompts as prompt, i}
        {@const isActive = i === activePrompt}
        {#if i > activePrompt || prompt === TerminalCommand.Clear}
          <!-- ... -->
        {:else if isString(prompt) || prompt.type === TerminalPromptType.Text}
          <TerminalLine
            text={isString(prompt) ? prompt : prompt.text}
            {...isString(prompt) ? {} : prompt}
            active={isActive}
            delay={i === 0 ? delay : 0}
            on:end={isActive ? nextPrompt : null}
          />
        {:else if prompt.type === TerminalPromptType.List}
          <TerminalListPrompt {...prompt} active={isActive} on:end={isActive ? nextPrompt : null} />
        {/if}
      {/each}
    </div>
  </div>
</section>
