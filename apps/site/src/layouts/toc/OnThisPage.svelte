<script lang="ts">
  import clsx from 'clsx';
  import { type MarkdownHeading } from '@vitebook/core';
  import { route, markdown } from '@vitebook/svelte';

  import RightArrowIcon from '~icons/ri/arrow-drop-right-line';

  import { getOnThisPageContext } from './context';
  import { useActiveHeaderLinks } from './active-headings';

  let __class = '';
  export { __class as class };

  export let style = '';

  const ctx = getOnThisPageContext();
  useActiveHeaderLinks(ctx);

  let headings: (MarkdownHeading & { children: MarkdownHeading[] })[] = [];

  $: {
    headings = [];

    let i = -1;
    let currentHeadings = $markdown?.headings.filter(({ level }) => level > 1) ?? [];

    for (const heading of currentHeadings) {
      if (heading.level === 3) {
        headings[i].children.push(heading);
      } else if (heading.level === 2) {
        i += 1;
        headings.push({ ...heading, children: [] });
      }
    }
  }
</script>

{#if headings.length > 1 || headings[0]?.children.length}
  <div class={clsx('on-this-page', __class)} {style}>
    <h5 class="font-semibold text-left text-gray-inverse text-lg w-full">On this page</h5>
    <ul class="space-y-4 mt-4">
      {#each headings as heading (heading.id)}
        <li
          class={clsx(
            ($ctx.cleanHash?.($route.url.hash) ?? $route.url.hash) === `#${heading.id}`
              ? 'text-brand'
              : 'text-gray-soft hover:text-gray-inverse',
          )}
        >
          <a href={`#${heading.id}`}>{heading.title}</a>
        </li>

        {#if heading.children.length > 0}
          <ul class="space-y-3">
            {#each heading.children as childHeader (childHeader.id)}
              <li
                class={clsx(
                  'flex group group',
                  ($ctx.cleanHash?.($route.url.hash) ?? $route.url.hash) === `#${childHeader.id}`
                    ? 'text-brand'
                    : 'text-gray-soft hover:text-gray-inverse',
                )}
              >
                <RightArrowIcon
                  width="20"
                  height="20"
                  class="mt-px mr-px text-gray-300 dark:text-gray-400 group-hover:text-gray-soft"
                />
                <a href={`#${childHeader.id}`}>{childHeader.title}</a>
              </li>
            {/each}
          </ul>
        {/if}
      {/each}
    </ul>
  </div>
{/if}
