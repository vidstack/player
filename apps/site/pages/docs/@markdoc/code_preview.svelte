<script lang="ts">
  import clsx from 'clsx';
  import { ariaBool } from '@vidstack/foundation';

  import { intersectionObserver } from '$src/actions/intersection-observer';
  import IndeterminateLoading from '$src/components/base/IndeterminateLoading.svelte';
  import { codePreviews } from '$src/stores/code-previews';

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
  class="code-preview rounded-md my-8 shadow-lg mx-auto overflow-hidden border border-gray-outline text-gray-300 prefers-dark-scheme"
  style="background-color: var(--code-fence-bg);"
  aria-busy={ariaBool(!hasLoaded)}
  use:intersectionObserver={{ callback: onIntersect }}
>
  <div
    class={clsx(
      'w-full rounded-md rounded-b-none overflow-auto relative scroll-contain scrollbar',
      'border-b border-gray-outline not-prose p-2 576:p-4 992:p-6',
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

    <div class="flex flex-col items-center justify-center min-h-full">
      <svelte:component this={component} />
    </div>
  </div>

  <CodeSnippets {name} {nums} {copy} {...$$restProps} />
</div>

<style>
  .code-preview :global(.code-snippets) {
    @apply rounded-none border-none m-0 shadow-none;
  }
</style>
