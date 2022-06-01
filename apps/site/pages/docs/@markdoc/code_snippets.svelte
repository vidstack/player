<script lang="ts">
  import clsx from 'clsx';
  import { codeSnippets } from '$src/stores/code-snippets';
  import { jsLibExts } from '$src/stores/js-lib';

  import CodeSnippet from './code_snippet.svelte';

  export let name: string;
  export let css = false;

  let activeTab = 0;

  $: snippetNames = [...$jsLibExts.map((ext) => `${name}${ext}`), css && `${name}.css`].filter(
    (name) => name && $codeSnippets.some((snippet) => snippet.name === name),
  );
</script>

<div
  class="code-snippets relative border border-gray-outline rounded-md shadow-lg overflow-hidden my-8 prefers-dark-scheme text-gray-300"
  style="background-color: var(--code-fence-bg);"
>
  {#if snippetNames.length > 1}
    <div
      class="code-snippets-tabs flex flex-row no-scrollbar not-prose z-10 border-b border-gray-outline"
    >
      <ul class="w-full list-none flex whitespace-nowrap">
        {#each snippetNames as name, i (name)}
          <li class="z-0 focus-within:z-10">
            <button
              class={clsx(
                'font-mono text-sm px-5 py-2 focus-visible:m-px',
                activeTab === i
                  ? 'border-brand border-b text-brand bg-gray-700'
                  : 'hover:text-white',
              )}
              on:click={() => {
                activeTab = i;
              }}
            >
              {name}
            </button>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
  <div class="z-0">
    {#each snippetNames as name, i (name)}
      {#if i === activeTab}
        <CodeSnippet
          {name}
          {...$$restProps}
          highlight={name.endsWith('.css') ? null : $$restProps.highlight}
          copySteps={name.endsWith('.css') ? false : $$restProps.copySteps}
        />
      {/if}
    {/each}
  </div>
</div>

<style>
  .code-snippets :global(.code-fence) {
    @apply m-0 rounded-none shadow-none border-0;
  }
</style>
