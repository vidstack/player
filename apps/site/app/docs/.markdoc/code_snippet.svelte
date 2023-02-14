<script lang="ts">
  import { codeSnippets } from '$lib/stores/code-snippets';
  import { jsLib, jsLibExts } from '$lib/stores/js-lib';

  import LazyCodeFence from './lazy_code_fence.svelte';

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

  if (import.meta.hot) {
    import.meta.hot.on('vidstack::invalidate_snippet', async ({ name, path, importPath }) => {
      if (currentSnippet && currentSnippet.path === path && filenames.includes(name)) {
        setTimeout(async () => {
          if (currentSnippet) currentSnippet.loader = () => import(/* @vite-ignore */ importPath);
        }, 150);
      }
    });
  }
</script>

<LazyCodeFence
  title={currentTitle}
  lines={currentSnippet?.lines}
  loader={currentSnippet?.loader}
  scrollX={currentSnippet?.scrollX}
  highlight={currentHighlight}
  {...$$restProps}
/>
