<script lang="ts">
  import clsx from 'clsx';

  import type { CodeSnippet, LazyCodeSnippet } from ':code_snippets';
  import { get } from 'svelte/store';

  import { codeSnippets } from '../../stores/code-snippets';
  import { isDarkColorScheme } from '../../stores/color-scheme';
  import IndeterminateLoadingSpinner from '../style/indeterminate-loading-spinner.svelte';
  import { getLoadedCodeSnippet, registerCodeSnippet } from './registry';

  export let id: string;
  export let transform: (code: string) => string = (s) => s;

  let _class: string | undefined = undefined;
  export { _class as class };

  let code = '',
    snippet: CodeSnippet | undefined;

  async function loadSnippet(loader: LazyCodeSnippet) {
    if (!import.meta.env.DEV) {
      const loadedSnippet = getLoadedCodeSnippet(id);
      if (loadedSnippet) {
        snippet = loadedSnippet;
        return;
      }
    }

    const mod = await loader.loader();
    snippet = mod.default;

    registerCodeSnippet(id, snippet);
  }

  async function loadCode(snippet: CodeSnippet, darkTheme: boolean) {
    code = (await snippet.code[darkTheme ? 'dark' : 'light']()).default;
  }

  if (import.meta.hot) {
    import.meta.hot.on(':invalidate_code_snippet', async ({ id, imports }) => {
      if (loader?.id !== id) return;

      if (snippet) {
        Object.assign(snippet.code, {
          light: () => import(/* @vite-ignore */ imports.code.light),
          dark: () => import(/* @vite-ignore */ imports.code.dark),
        });
      }

      snippet = (await import(/* @vite-ignore */ imports.snippet)).default;
    });
  }

  $: loader = $codeSnippets.find((snippet) => snippet.id === id);
  $: if (loader) loadSnippet(loader);

  $: if (snippet) loadCode(snippet, $isDarkColorScheme);
</script>

<pre class={clsx('min-h-full inline-flex not-prose', _class)}>
  {#if loader && !code}
    <IndeterminateLoadingSpinner class="absolute top-2 right-4" />
    <code
      class="inline-block"
      style={`width: ${loader.width * 9.48}px; height: ${loader.lines * 22}px;`}></code>
  {/if}
  {@html transform(code)}
</pre>
