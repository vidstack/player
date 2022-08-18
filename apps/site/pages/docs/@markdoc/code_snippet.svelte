<script lang="ts">
  import clsx from 'clsx';
  import { ariaBool } from '@vidstack/foundation';

  import { jsLib, jsLibExts } from '$src/stores/js-lib';
  import { intersectionObserver } from '$src/actions/intersection-observer';
  import { codeSnippets } from '$src/stores/code-snippets';
  import IndeterminateLoading from '$src/components/base/IndeterminateLoading.svelte';

  import CodeFence from './@nodes/fence.svelte';

  export let name: string;
  export let title: string | null = null;
  export let highlight: string | null = null;

  function getExt(name: string) {
    const parts = name.split('.');
    return `.${parts[parts.length - 1]}`;
  }

  $: filenames = !name.includes('.') ? $jsLibExts.map((ext) => `${name}${ext}`) : [name];

  $: currentSnippet = $codeSnippets.find((snippet) =>
    filenames.some((filename) => snippet.name === filename),
  );

  $: currentTitle = currentSnippet ? title?.replace('$ext', getExt(currentSnippet.name)) : '';

  $: currentHighlight =
    highlight?.includes('|') || /^\w+:/.test(highlight ?? '')
      ? highlight!
          .split('|') // "html:3,4-5|react:3-5"
          .map((h) => h.split(':'))
          .find((h) => h[0] === $jsLib)?.[1]
      : highlight;

  $: estimatedCodeHeight = (currentSnippet?.lines ?? 0) * 27;

  $: lineNums =
    currentSnippet && $$restProps.nums
      ? [...Array(currentSnippet.lines).keys()].map((n) => n + 1)
      : [];

  let tokens;
  let hasLoaded = false;
  let isVisible = false;

  $: if (isVisible) loadSnippet(currentSnippet);

  async function loadSnippet(snippet) {
    hasLoaded = false;
    if (!snippet) return;
    tokens = await snippet?.loader();
    hasLoaded = true;
  }

  const onIntersect: IntersectionObserverCallback = (entries) => {
    if (entries[0].isIntersecting) {
      isVisible = true;
    }
  };

  if (import.meta.hot) {
    import.meta.hot.on('vidstack::invalidate_snippet', async ({ name, path, importPath }) => {
      if (currentSnippet && currentSnippet.path === path && filenames.includes(name)) {
        tokens = await import(/* @vite-ignore */ importPath);
      }
    });
  }
</script>

{#if currentSnippet && !hasLoaded}
  <div
    class="code-fence scrollbar 576:max-h-[32rem] border-elevate-border prefers-dark-scheme relative my-8 mx-auto max-h-[60vh] overflow-y-auto rounded-md border-[1.5px] shadow-lg"
    style="background-color: var(--code-fence-bg);"
    aria-busy={ariaBool(!hasLoaded)}
    use:intersectionObserver={{ callback: onIntersect }}
  >
    <IndeterminateLoading />

    {#if $$restProps.copy}
      <div style="height: 44px;" />
    {:else if currentTitle}
      <div style="height: 28px;" />
    {/if}

    <div class="code relative z-0 overflow-hidden">
      <div class={clsx($$restProps.nums && '992:pl-10')}>
        <pre
          class={clsx(
            'scrollbar m-0',
            $$restProps.nums && lineNums.length >= 100 ? 'pl-6' : 'pl-3',
          )}>
          <code
            style={clsx(
              `width: ${currentSnippet.scrollX * 9.48}px;`,
              `height: ${estimatedCodeHeight}px;`,
            )}
          />
        </pre>
      </div>

      {#if $$restProps.nums}
        <pre
          class="992:flex absolute top-3.5 left-0 m-0 hidden flex-col text-sm leading-[27px]"
          style="border-radius: 0; padding-top: 0;">
          <div
            class="text-300 992:block hidden flex-none select-none text-right"
            aria-hidden="true">{lineNums.join('\n')}</div>
		    </pre>
      {/if}
    </div>
  </div>
{:else if tokens}
  <CodeFence {...tokens} title={currentTitle} highlight={currentHighlight} {...$$restProps} />
{/if}
