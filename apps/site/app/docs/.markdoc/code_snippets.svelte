<script lang="ts">
  import clsx from 'clsx';

  import { codeSnippets } from '$lib/stores/code-snippets';
  import { jsLibExts } from '$lib/stores/js-lib';

  import CodeSnippet from './code_snippet.svelte';

  export let name: string;
  export let css = false;

  let activeTab = 0;

  $: snippetNames = [...$jsLibExts.map((ext) => `${name}${ext}`), css && `${name}.css`].filter(
    (name) => name && $codeSnippets.some((snippet) => snippet.name === name),
  );
</script>

<div
  class="code-snippets border-border prefers-dark-scheme relative my-8 overflow-hidden rounded-md border-[1.5px] text-gray-300"
  style="background-color: var(--code-fence-bg);"
>
  {#if snippetNames.length > 1}
    <div
      class="code-snippets-tabs no-scrollbar not-prose border-border z-10 flex flex-row border-b"
    >
      <ul class="flex w-full list-none whitespace-nowrap">
        {#each snippetNames as name, i (name)}
          <li class="z-0 focus-within:z-10">
            <button
              class={clsx(
                'px-5 py-2 font-mono text-sm focus-visible:m-px',
                activeTab === i
                  ? 'border-brand text-brand border-b bg-gray-700'
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
    @apply m-0 rounded-none border-0 shadow-none;
  }
</style>
