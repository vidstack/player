<script lang="ts">
  import { onMount } from 'svelte';
  import { listen } from 'svelte/internal';

  export let value = '';
  export let placeholder = '';
  export let shortcutSlash = false;
  export let shortcutKey: string | null = null;

  let input: HTMLInputElement;

  onMount(() => {
    return listen(document, 'keydown', (event) => {
      const keyboardEvent = event as KeyboardEvent;
      if (
        (keyboardEvent.metaKey && keyboardEvent.key === shortcutKey) ||
        (shortcutSlash && keyboardEvent.key === '/')
      ) {
        event.stopPropagation();
        requestAnimationFrame(() => input.focus());
      }
    });
  });
</script>

<div class="relative flex-auto group">
  <input
    class="border-b-2 font-base text-base placeholder:text-slate border-border w-full p-2 pl-8 block appearance-none"
    type="search"
    {placeholder}
    bind:value
    bind:this={input}
    style="background: none;"
    on:input
  />
  <svg
    class="pointer-events-none absolute inset-y-0 left-1 h-full w-5 text-border group-focus-within:text-brand transition-colors duration-300 -mt-px"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M11.1293 13.4711C11.0947 13.4365 11.0402 13.4321 11.0001 13.4601C9.86626 14.251 8.4873 14.7148 7 14.7148C3.13401 14.7148 0 11.5808 0 7.71484C0 3.84885 3.13401 0.714844 7 0.714844C10.866 0.714844 14 3.84885 14 7.71484C14 9.20245 13.536 10.5817 12.7447 11.7157C12.7167 11.7558 12.7212 11.8103 12.7558 11.8449L15.6463 14.7354C15.8416 14.9307 15.8416 15.2472 15.6463 15.4425L14.7271 16.3617C14.5318 16.557 14.2152 16.557 14.0199 16.3617L11.1293 13.4711ZM11.7012 7.71484C11.7012 10.3107 9.59682 12.415 7.00098 12.415C4.40513 12.415 2.30078 10.3107 2.30078 7.71484C2.30078 5.119 4.40513 3.01465 7.00098 3.01465C9.59682 3.01465 11.7012 5.119 11.7012 7.71484Z"
      fill="currentColor"
    />
  </svg>
  {#if shortcutKey || shortcutSlash}
    <div
      class="px-2 py-px font-mono text-sm font-bold border border-border bg-elevate text-inverse flex items-center justify-center absolute right-1 top-2 rounded-sm"
    >
      {shortcutSlash ? '/' : `⌘ + ${shortcutKey}`}
    </div>
  {/if}
  <slot />
</div>
