<script lang="ts">
  import type { MarkdownHeading } from '@vessel-js/app';
  import { markdown, route } from '@vessel-js/svelte';
  import clsx from 'clsx';
  import RightArrowIcon from '~icons/ri/arrow-drop-right-line';

  import { useActiveHeaderLinks } from './active-headings';
  import { getOnThisPageContext } from './context';

  let __class = '';
  export { __class as class };

  export let style = '';

  const { fallback, config } = getOnThisPageContext();
  useActiveHeaderLinks(config);

  let headings: (MarkdownHeading & { children: MarkdownHeading[] })[] = [];

  $: {
    headings = [];

    let i = -1;
    let currentHeadings = ($markdown?.headings ?? $fallback ?? []).filter(({ level }) => level > 1);

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

<div class={clsx('on-this-page', __class)} {style}>
  {#if headings.length > 1 || headings[0]?.children.length}
    <h5 class="text-inverse w-full text-left text-lg font-semibold">On this page</h5>
    <ul class="mt-4 space-y-4">
      {#each headings as heading (heading.id)}
        <li
          class={clsx(
            ($config.cleanHash?.($route.matchedURL.hash) ?? $route.matchedURL.hash) ===
              `#${heading.id}`
              ? 'text-brand'
              : 'text-soft hover:text-inverse',
          )}
        >
          <a href={`#${heading.id}`}>{heading.title}</a>
        </li>

        {#if heading.children.length > 0}
          <ul class="space-y-3">
            {#each heading.children as childHeader (childHeader.id)}
              <li
                class={clsx(
                  'group group flex',
                  ($config.cleanHash?.($route.matchedURL.hash) ?? $route.matchedURL.hash) ===
                    `#${childHeader.id}`
                    ? 'text-brand'
                    : 'text-soft hover:text-inverse',
                )}
              >
                <RightArrowIcon
                  width="20"
                  height="20"
                  class="group-hover:text-inverse mt-px mr-px text-soft"
                />
                <a href={`#${childHeader.id}`}>{childHeader.title}</a>
              </li>
            {/each}
          </ul>
        {/if}
      {/each}
    </ul>
  {/if}
</div>
