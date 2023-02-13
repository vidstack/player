<script lang="ts">
  import uFuzzy from '@leeoniya/ufuzzy';
  import { route } from '@vessel-js/svelte';
  import clsx from 'clsx';
  import { onMount, tick } from 'svelte';
  import ArrowDropDownIcon from '~icons/ri/arrow-drop-down-fill';
  import QuestionIcon from '~icons/ri/question-fill';

  import { env } from '$lib/env';
  import type { ComponentApi } from '$lib/server/component-api';
  import { jsLib } from '$lib/stores/js-lib';
  import { ariaBool } from '$lib/utils/aria';
  import { camelToKebabCase, camelToTitleCase, kebabToPascalCase } from '$lib/utils/string';

  import SearchInput from '../base/SearchInput.svelte';

  export let api: ComponentApi;

  let currentKey;
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
    if (!category) return [];
    return category.filter((prop) => prop.docs);
  }

  function propToKey(category: string, propName: string) {
    return `${category}_${propName.toLowerCase()}`;
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

  onMount(() => {
    tick().then(onHashChange);
  });

  function onHashChange() {
    if (!$route.matchedURL.hash) return;

    const hash = $route.matchedURL.hash;
    const key = hash.slice(1);

    if (!key.includes('_')) return;

    const category = key.split('_')[0];
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
      currentKey = key;
      _isOpen[key] = true;
      tick().then(() => {
        scroll.scrollTo({ top: container.offsetTop });
      });
    }
  }

  $: if (env.browser && $route.matchedURL.hash) {
    tick().then(onHashChange);
  }

  const shortcutKeys = {
    props: 'x',
    events: 'e',
    slots: 'b',
    cssVars: 'v',
    cssParts: 'c',
    instanceProps: 'i',
    instanceMethods: 'v',
  };

  const fuzzy = new uFuzzy();
  const properties = {};
  const searchedProperties = {};
  for (const category of categories) {
    properties[category] = filterHasDocs(api[category]);
    searchedProperties[category] = properties[category];
  }
</script>

{#each categories as category (category)}
  {@const showAll = _showAll[category]}
  {@const hasTypes = !noTypes.has(category)}
  {@const hasReadonly = readonlyRE.test(category)}
  {@const searchNames = properties[category].map((p) => p.name.toLowerCase().replace(/-/g, ''))}
  {#if properties[category].length > 0}
    {@const categoryTitle = camelToTitleCase(category).replace('Css', 'CSS')}
    <div class="mt-12 mb-6 flex flex-col justify-center">
      <div class="flex items-center">
        <h2 id={category} class="m-0">
          <a class="header-anchor" href={`#${category}`} aria-hidden="true">#</a>
          {categoryTitle}
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
      {#if searchNames.length > 15}
        <div class="mt-4">
          <SearchInput
            placeholder={`Search ${categoryTitle}...`}
            shortcutKey={shortcutKeys[category]}
            on:input={(e) => {
              const value = e.target.value;
              const indicies = fuzzy.filter(searchNames, value.toLowerCase().replace(/\s/g, ''));
              searchedProperties[category] = indicies.map((i) => properties[category][i]);
            }}
          />
        </div>
      {/if}
    </div>

    <div
      id={`scroll-${category}`}
      class={clsx(
        'border-border scrollbar scroll-contain relative flex flex-col overflow-auto border',
        !showAll && 'max-h-[445px]',
      )}
    >
      {#each searchedProperties[category] as prop (prop)}
        {@const key = propToKey(category, prop.name)}
        {@const isOpen = _isOpen[key]}
        {@const hasLink = 'link' in prop}

        <div
          id={key}
          class={clsx(
            'border-border flex flex-col',
            isOpen && (!currentKey || currentKey == key)
              ? 'border-2 border-soft'
              : 'border-b last:border-0',
          )}
        >
          <div class="not-prose w-ful relative">
            <h3 class="text-inverse font-medium">
              <button
                id={key}
                class={clsx(
                  'h-full w-full py-1.5 px-2.5 text-left select-text hover:text-inverse',
                  isOpen && (!currentKey || key === currentKey)
                    ? 'text-inverse'
                    : 'text-soft hover:bg-elevate',
                )}
                aria-controls={`accordion-${key}`}
                aria-expanded={ariaBool(isOpen)}
                on:click={() => {
                  _isOpen[currentKey] = false;
                  _isOpen[key] = !_isOpen[key];
                  currentKey = key;
                  window.history.pushState({}, '', `#${key}`);
                }}
              >
                <code class="font-medium text-sm">
                  {category === 'events' && $jsLib === 'react'
                    ? jsxEventName(prop.name)
                    : prop.name}
                </code>

                {#if hasReadonly && prop.readonly}
                  <span
                    class="bg-border ml-1.5 rounded-md py-0.5 px-1.5 font-mono text-xs"
                    aria-hidden="true"
                  >
                    readonly
                  </span>
                {/if}
              </button>
            </h3>
            <ArrowDropDownIcon
              class={clsx(
                'absolute top-2 right-2 transform transition-transform duration-150 pointer-events-none',
                isOpen && 'rotate-180',
              )}
              width="20"
              height="20"
              role="none"
            />
          </div>

          <div
            id={`accordion-${key}`}
            aria-labelledby={key}
            class={clsx(
              !isOpen && 'hidden',
              'prose dark:prose-invert relative p-4 pt-2 pl-2.5 pb-0',
            )}
          >
            {#if hasTypes}
              <div class="flex flex-col space-y-2 font-mono">
                {#each getInfo(category, prop) as [title, code] (title)}
                  <div>
                    <span class="text-inverse underline text-sm leading-relaxed">{title}:</span>
                    <code
                      class="-ml-1 text-indigo-500 text-xs dark:text-indigo-300 leading-relaxed"
                    >
                      {code}
                    </code>
                  </div>
                {/each}
              </div>
            {/if}

            {#if hasLink}
              <a
                class="absolute top-2 right-5 text-sm"
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
  {/if}
{/each}
