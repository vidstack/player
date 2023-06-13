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

  const { override, config } = getOnThisPageContext();
  const index = useActiveHeaderLinks(config);

  let headings: (MarkdownHeading & { children: MarkdownHeading[] })[] = [];

  $: {
    headings = [];

    let i = -1;
    let currentHeadings = ($override ?? $markdown?.headings ?? []).filter(({ level }) => level > 1);

    for (const heading of currentHeadings) {
      if (heading.level === 3) {
        headings[i].children.push(heading);
      } else if (heading.level === 2) {
        i += 1;
        headings.push({ ...heading, children: [] });
      }
    }
  }

  function calcIndex(heading) {
    let sum = 0;

    for (let i = 0; i < headings.length; i++) {
      if (headings[i] === heading) return sum;
      sum += 1 + headings[i].children.length;
    }

    return sum;
  }
</script>

<div class={clsx('on-this-page', __class)} {style}>
  {#if headings.length > 1 || headings[0]?.children.length}
    <h5 class="text-inverse w-full text-left text-[15px] font-semibold">On this page</h5>
    <ul class="mt-3 space-y-3 text-sm">
      {#each headings as heading (heading)}
        {@const i = calcIndex(heading)}
        {@const activeParent =
          i === $index || heading.children.some((_, j) => i + j + 1 === $index)}
        <li class={clsx(activeParent ? 'text-brand font-medium' : 'text-soft hover:text-inverse')}>
          <a href={`#${heading.id}`}>{heading.title}</a>
        </li>

        {#if heading.children.length > 0}
          <ul class="space-y-2.5">
            {#each heading.children as childHeader, j (childHeader)}
              <li
                class={clsx(
                  'group group flex',
                  i + j + 1 === $index ? 'text-brand' : 'text-soft hover:text-inverse',
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
