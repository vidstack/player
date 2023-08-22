<script lang="ts">
  import clsx from 'clsx';

  import SearchIcon from '~icons/lucide/search';

  import { onMount } from 'svelte';

  import { listenEvent } from '../utils/events';

  export let value = '';
  export let placeholder = '';
  export let shortcutKeys: string[] = ['/', 'meta+k'];

  let input: HTMLInputElement;

  onMount(() => {
    return listenEvent(document, 'keydown', (event) => {
      let isValid = false;

      for (const key of shortcutKeys) {
        const metaKey = !key.startsWith('meta') || event.metaKey;
        if (metaKey && event.key === key.replace('meta+', '')) {
          isValid = true;
          break;
        }
      }

      if (!isValid) return;

      event.stopPropagation();
      requestAnimationFrame(() => input.focus());
    });
  });

  $: shortcutKeyText = !shortcutKeys[0].includes('meta')
    ? '/'
    : `⌘ + ${shortcutKeys[0].replace('meta+', '')}`;
</script>

<div class="relative flex-auto group">
  <SearchIcon
    class={clsx(
      'w-5 h-full pointer-events-none absolute inset-y-0 left-1 text-soft',
      'group-focus-within:text-brand transition-colors duration-200 -mt-px',
    )}
  />

  <input
    class={clsx(
      'border-b-2 focus:border-brand font-base text-base placeholder:text-soft',
      'border-border w-full p-2 pl-8 block appearance-none transition-colors duration-200',
    )}
    type="search"
    {placeholder}
    bind:value
    bind:this={input}
    style="background: none;"
    on:input
  />

  <div
    class={clsx(
      'px-2 py-px font-mono text-sm font-bold border-border bg-inverse text-inverse',
      'flex items-center justify-center absolute right-1 top-2 rounded-sm shadow-sm',
    )}
  >
    {shortcutKeyText}
  </div>
</div>
