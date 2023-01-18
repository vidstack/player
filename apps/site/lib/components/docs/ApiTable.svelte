<script lang="ts">
  import { route } from '@vessel-js/svelte';
  import clsx from 'clsx';
  import { tick } from 'svelte';
  import ArrowDropDownIcon from '~icons/ri/arrow-drop-down-fill';
  import QuestionIcon from '~icons/ri/question-fill';

  import { env } from '$lib/env';
  import type { ComponentApi } from '$lib/server/component-api';
  import { jsLib } from '$lib/stores/js-lib';
  import { ariaBool } from '$lib/utils/aria';
  import { camelToTitleCase, kebabToPascalCase } from '$lib/utils/string';

  export let api: ComponentApi;

  let _isOpen = {};
  let _showAll = {};
  let isAllOpen = {};

  const categories = Object.keys(api); // ['props', 'events', 'slots', ...]

  const readonlyRE = /props|instanceProps|cssVars/;
  const noTypes = new Set(['slots', 'cssParts']);

  const categoryLinks = {
    slots:
      'https://developers.google.com/web/fundamentals/web-components/shadowdom#composition_slot',
    cssVars: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties',
    cssParts: 'https://developer.mozilla.org/en-US/docs/Web/CSS/::part',
  };

  function isMDNLink(link: string) {
    return /(mdn|mozilla)/.test(link);
  }

  function filterHasDocs(category) {
    return category.filter((prop) => prop.docs);
  }

  function propToKey(category: string, propName: string) {
    return `${category}--${propName.toLowerCase()}`;
  }

  function jsxEventName(eventName: string) {
    return `on${kebabToPascalCase(eventName)}`;
  }

  function getInfo(category: string, prop: any) {
    return [
      category === 'props' &&
        prop.attr &&
        !prop.readonly &&
        $jsLib !== 'react' && ['Attribute', prop.attr],
      prop.type && ['Type', prop.type],
      category === 'events' && ['Detail', prop.detail],
    ].filter(Boolean);
  }

  function onHashChange() {
    if (!$route.matchedURL.hash) return;

    const hash = $route.matchedURL.hash;
    const key = hash.slice(1);

    if (!key.includes('--')) return;

    const category = key.split('--')[0];
    const heading = document.getElementById(category);
    const scroll = document.getElementById(`scroll-${category}`);
    const container = document.getElementById(key);

    if (heading) {
      tick().then(() => {
        // 128 padding for navbar.
        window.scrollTo({
          top: window.pageYOffset + heading.getBoundingClientRect().top - 128,
        });
      });
    }

    if (scroll && container) {
      _isOpen[key] = true;
      tick().then(() => {
        scroll.scrollTo({ top: container.offsetTop });
      });
    }
  }

  $: if (env.browser && $route.matchedURL.hash) {
    tick().then(onHashChange);
  }
</script>

{#each categories as category (category)}
  {@const showAll = _showAll[category]}
  {@const hasTypes = !noTypes.has(category)}
  {@const hasReadonly = readonlyRE.test(category)}

  {#if api[category] && filterHasDocs(api[category]).length > 0}
    <div>
      <div class="mt-[2em] mb-[0.666em] flex items-center">
        <h2 id={category} class="m-0">
          <a class="header-anchor" href={`#${category}`} aria-hidden="true">#</a>
          {camelToTitleCase(category).replace('Css', 'CSS')}
        </h2>
        {#if categoryLinks[category]}
          <a
            class="flex h-full transform items-center border-0 px-2.5 transition-transform ease-in hover:scale-110"
            href={categoryLinks[category]}
            target="_blank"
            rel="noreferrer"
          >
            <span class="sr-only">Learn more about {category}</span>
            <QuestionIcon width="24" height="24" />
          </a>
        {/if}
      </div>

      <div
        id={`scroll-${category}`}
        class={clsx(
          'border-border scrollbar scroll-contain relative mt-[2em] flex flex-col overflow-auto border',
          !showAll && 'max-h-[375px]',
        )}
      >
        {#each filterHasDocs(api[category]) as prop (prop)}
          {@const key = propToKey(category, prop.name)}
          {@const isOpen = _isOpen[key]}
          {@const hasLink = 'link' in prop}

          <div
            id={key}
            class={clsx(
              'border-border flex flex-col border-b last:border-0',
              'hover:bg-elevate',
              isOpen && 'border-b first:border-b last:border-0',
            )}
          >
            <div class="not-prose w-ful relative">
              <h3 class="text-inverse text-sm font-medium">
                <button
                  id={`accordion-btn-${key}`}
                  class="h-full w-full py-2.5 px-2.5 text-left"
                  aria-controls={`accordion-${key}`}
                  aria-expanded={ariaBool(isOpen)}
                  on:click={() => {
                    _isOpen[key] = !_isOpen[key];
                    window.history.pushState({}, '', `#${key}`);
                  }}
                >
                  <code class="font-semibold text-xs">
                    {category === 'events' && $jsLib === 'react'
                      ? jsxEventName(prop.name)
                      : prop.name}
                  </code>

                  {#if hasReadonly && prop.readonly}
                    <span class="bg-border ml-1.5 rounded-md py-0.5 px-1.5 font-mono text-xs">
                      readonly
                    </span>
                  {/if}
                </button>
              </h3>
              <ArrowDropDownIcon
                class={clsx(
                  'absolute top-2 right-2 transform transition-transform duration-150',
                  isOpen && 'rotate-180',
                )}
                width="20"
                height="20"
                role="none"
              />
            </div>

            <div
              id={`accordion-${key}`}
              aria-labelledby={`accordion-btn-${key}`}
              class={clsx(
                !isOpen && 'hidden',
                'prose dark:prose-invert relative p-4 pt-2 pl-2.5 pb-0',
              )}
            >
              {#if hasTypes}
                <div class="flex flex-col space-y-3 font-mono text-xs">
                  {#each getInfo(category, prop) as [title, code] (title)}
                    <div>
                      <span class="text-inverse">{title}:</span>
                      <code class="-ml-1 text-indigo-500 dark:text-indigo-300">
                        {code}
                      </code>
                    </div>
                  {/each}
                </div>
              {/if}

              {#if hasLink}
                <a
                  class="absolute top-2 right-5 text-xs"
                  href={prop.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  {isMDNLink(prop.link) ? 'MDN' : 'Reference'}
                </a>
              {/if}

              <div class={clsx('pb-4 text-sm', hasTypes && 'mt-5')}>
                {@html prop.docs}
              </div>
            </div>
          </div>
        {/each}
      </div>

      {#if filterHasDocs(api[category]).length > 3}
        <div class="text-soft mt-4 flex items-center justify-end text-sm">
          <button
            class="hover:text-inverse rounded-sm py-1 px-2.5 font-medium"
            aria-checked={ariaBool(isAllOpen[category])}
            on:click={() => {
              isAllOpen[category] = !isAllOpen[category];

              for (const prop of api[category]) {
                const key = propToKey(category, prop.name);
                _isOpen[key] = isAllOpen[category];
              }
            }}
          >
            {!isAllOpen[category] ? 'Open All' : 'Close All'}
          </button>

          {#if isAllOpen[category] || filterHasDocs(api[category]).length > 10}
            <button
              class="hover:text-inverse rounded-sm py-1 px-2.5 font-medium"
              aria-checked={ariaBool(showAll)}
              on:click={() => {
                _showAll[category] = !_showAll[category];
              }}
            >
              {showAll ? 'Show Less' : 'Show All'}
            </button>
          {/if}
        </div>
      {/if}
    </div>
  {/if}
{/each}
