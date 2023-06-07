<script lang="ts">
  import clsx from 'clsx';

  import { intersectionObserver } from '$lib/actions/intersection-observer';
  import IndeterminateLoading from '$lib/components/base/IndeterminateLoading.svelte';
  import { codePreviews } from '$lib/stores/code-previews';
  import { ariaBool } from '$lib/utils/aria';

  import CodeSnippets from './code_snippets.svelte';

  export let name: string;
  export let copy = true;
  export let nums = true;
  export let size: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' = 'medium';

  $: preview = $codePreviews.find((preview) => preview.name === name);

  let component;
  let hasLoaded = false;
  let isVisible = false;

  $: if (isVisible) loadPreview(preview);

  async function loadPreview(preview) {
    if (!preview) return;
    hasLoaded = false;
    const mod = await preview?.loader();
    component = mod.default;
    hasLoaded = true;
  }

  const onIntersect: IntersectionObserverCallback = (entries) => {
    if (entries[0].isIntersecting) {
      isVisible = true;
    }
  };
</script>

<div
  class="code-preview text-soft my-8 mx-auto overflow-hidden rounded-md shadow-xl border-border border prefers-dark-scheme"
  style="background-color: var(--code-preview-bg); --media-focus-ring: 0 0 0 3px rgb(78 156 246);"
  aria-busy={ariaBool(!hasLoaded)}
  use:intersectionObserver={{ callback: onIntersect }}
>
  <div
    class={clsx(
      'scroll-contain scrollbar relative w-full overflow-auto rounded-md rounded-b-none',
      'border-border not-prose 576:p-4 992:p-6 border-b p-2',
      size === 'xsmall' && 'h-[7rem] max-h-28',
      size === 'small' && 'h-[12rem] max-h-48',
      size === 'medium' && 'h-[18rem] max-h-72',
      size === 'large' && 'h-[24rem] max-h-96',
      size === 'xlarge' && 'h-[32rem] max-h-[32rem]',
    )}
  >
    {#if !hasLoaded}
      <IndeterminateLoading />
    {/if}

    <div class="flex min-h-full flex-col items-center justify-center">
      <svelte:component this={component} />
    </div>
  </div>

  <CodeSnippets {name} {nums} {copy} {...$$restProps} />
</div>

<style>
  .code-preview :global(.code-snippets) {
    @apply m-0 rounded-none border-none shadow-none;
  }
</style>
