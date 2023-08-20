<script lang="ts">
  import clsx from 'clsx';

  import type { CodeSnippet, LazyCodeSnippet } from ':code_snippets';
  import { get } from 'svelte/store';

  import { codeSnippets } from '../../stores/code-snippets';
  import { isDarkColorScheme } from '../../stores/color-scheme';
  import IndeterminateLoadingSpinner from '../style/indeterminate-loading-spinner.svelte';

  export let id: string;

  let _class: string | undefined = undefined;
  export { _class as class };

  let code = '',
    snippet: CodeSnippet | undefined;

  async function loadSnippet(loader: LazyCodeSnippet) {
    const mod = await loader.loader();
    snippet = mod.default;
  }

  async function loadCode(snippet: CodeSnippet, darkTheme: boolean) {
    code = (await snippet.code[darkTheme ? 'dark' : 'light']()).default;
  }

  const loader = $codeSnippets.find((snippet) => snippet.id === id);
  if (loader) loadSnippet(loader);

  $: if (snippet) loadCode(snippet, $isDarkColorScheme);

  if (import.meta.hot) {
    import.meta.hot.on(':invalidate_code_snippet', async ({ id, imports }) => {
      if (loader?.id !== id) return;

      snippet = (await import(/* @vite-ignore */ imports.snippet)).default;

      if (snippet) {
        snippet.code.light = () => import(/* @vite-ignore */ imports.code.light);
        snippet.code.dark = () => import(/* @vite-ignore */ imports.code.dark);
      }

      const theme = get(isDarkColorScheme) ? 'dark' : 'light';
      code = (await import(/* @vite-ignore */ imports.code[theme])).default;
    });
  }
</script>

<!-- Don't mess with content inside pre tag - line breaks will show up and mess up layout. -->
<pre class={clsx('relative w-full min-h-full', _class)}>
{#if loader && !code}
    <IndeterminateLoadingSpinner class="absolute top-2 right-2" />
    <code
      class="inline-block"
      style={`width: ${loader.width * 9.48}px; height: ${loader.lines * 22}px;`}
    />
  {/if}{@html code}
</pre>
