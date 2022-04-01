<script lang="ts">
  import clsx from 'clsx';

  import RightArrowIcon from '~icons/ri/arrow-drop-right-line';

  import { hasMarkdownHeaders, markdownMeta } from '$lib/stores/markdown';
  import { page } from '$app/stores';
  import { useActiveHeaderLinks } from './useActiveHeaderLinks';

  useActiveHeaderLinks();

  let __class = '';
  export { __class as class };

  export let style = '';
</script>

{#if $hasMarkdownHeaders}
  <div class={clsx('on-this-page', __class)} {style}>
    <h5 class="font-semibold w-full text-left text-gray-inverse text-lg">On this page</h5>
    <ul class="space-y-4 mt-4">
      {#each $markdownMeta.headers as header (header.slug)}
        <li
          class={clsx(
            $page.url.hash === `#${header.slug}`
              ? 'text-brand'
              : 'text-gray-soft hover:text-gray-inverse',
          )}
        >
          <a href={`#${header.slug}`}>{header.title}</a>
        </li>
        {#if header.children.length > 0}
          <ul class="space-y-3">
            {#each header.children as childHeader (childHeader.slug)}
              <li
                class={clsx(
                  'flex group group',
                  $page.url.hash === `#${childHeader.slug}`
                    ? 'text-brand'
                    : 'text-gray-soft hover:text-gray-inverse',
                )}
              >
                <RightArrowIcon
                  width="20"
                  height="20"
                  class="mr-px mt-px text-gray-300 dark:text-gray-400 group-hover:text-gray-soft"
                />
                <a href={`#${childHeader.slug}`}>{childHeader.title}</a>
              </li>
            {/each}
          </ul>
        {/if}
      {/each}
    </ul>
  </div>
{/if}
