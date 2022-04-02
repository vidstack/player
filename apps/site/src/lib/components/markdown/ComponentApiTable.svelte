<script context="module" lang="ts">
  type ComponentApi = {
    properties: {
      name: string;
      description?: string;
      readonly: boolean;
      type: string;
      link?: string;
      attr?: string;
      hasAttr: boolean;
    }[];
    methods: {
      name: string;
      static: boolean;
      description?: string;
      type: string;
      link?: string;
    }[];
    events: {
      name: string;
      description?: string;
      type: string;
      link?: string;
      detail?: string;
    }[];
    slots: {
      name: string;
      description?: string;
    }[];
    cssProps: {
      name: string;
      description?: string;
    }[];
    cssParts: {
      name: string;
      description?: string;
    }[];
  };
</script>

<script lang="ts">
  import clsx from 'clsx';
  import { tick } from 'svelte';

  import QuestionIcon from '~icons/ri/question-fill';
  import ArrowDropDownIcon from '~icons/ri/arrow-drop-down-fill';

  import { page } from '$app/stores';
  import { browser } from '$app/env';
  import { ariaBool, camelToKebabCase, camelToTitleCase } from '@vidstack/foundation';
  import { isReactPath } from '$lib/stores/path';

  export let api: ComponentApi;

  let _isOpen = {};
  let _showAll = {};
  let isAllOpen = {};

  const categories = Object.keys(api); // ['properties', 'methods', 'events', ...]
  const noTypes = new Set(['slots', 'cssProps', 'cssParts']);

  const categoryLinks = {
    slots:
      'https://developers.google.com/web/fundamentals/web-components/shadowdom#composition_slot',
    cssProps: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties',
    cssParts: 'https://developer.mozilla.org/en-US/docs/Web/CSS/::part',
  };

  function isMDNLink(link: string) {
    return /(mdn|mozilla)/.test(link);
  }

  function filterHasDesc(category) {
    return category.filter((prop) => prop.description);
  }

  function propToKey(category: string, propName: string) {
    return `${category}--${propName.toLowerCase()}`;
  }

  function getInfo(category: string, prop: any) {
    return [
      category === 'properties' &&
        prop.hasAttr &&
        !prop.readonly &&
        !$isReactPath && ['Attribute', prop.attr ?? camelToKebabCase(prop.name)],
      [category === 'methods' ? 'Signature' : 'Type', prop.type],
      category === 'events' && ['Detail', prop.detail],
    ].filter(Boolean);
  }

  function onHashChange() {
    if (!$page.url.hash) return;

    const hash = $page.url.hash;
    const key = hash.slice(1);
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

  $: if (browser && $page.url.hash) {
    tick().then(onHashChange);
  }
</script>

{#each categories as category (category)}
  {@const showAll = _showAll[category]}
  {@const hasTypes = !noTypes.has(category)}
  {@const hasReadonly = category === 'properties'}

  {#if filterHasDesc(api[category]).length > 0}
    <div>
      <div class="mt-[2em] mb-[0.666em] flex items-center">
        <h2 id={category} class="m-0">
          <a class="header-anchor" href={`#${category}`} aria-hidden="true">#</a>
          {camelToTitleCase(category).replace('Css', 'CSS')}
        </h2>
        {#if categoryLinks[category]}
          <a
            href={categoryLinks[category]}
            target="_blank"
            class="hover:text-gray-inverse flex h-full items-center border-0 px-2.5 text-gray-300"
          >
            <span class="sr-only">Learn more about {category}</span>
            <QuestionIcon width="24" height="24" />
          </a>
        {/if}
      </div>

      <div
        id={`scroll-${category}`}
        class={clsx(
          'border-gray-divider relative flex flex-col border',
          'scrollbar:!w-1.5 scrollbar:!h-1.5 scrollbar:bg-transparent overflow-auto',
          'scrollbar-track:!bg-gray-divider scrollbar-thumb:!rounded scrollbar-thumb:!bg-gray-300',
          'scrollbar-track:!rounded mt-[2em]',
          !showAll && 'max-h-[390px]',
        )}
      >
        {#each filterHasDesc(api[category]) as prop (prop)}
          {@const key = propToKey(category, prop.name)}
          {@const isOpen = _isOpen[key]}
          {@const hasLink = 'link' in prop}

          <div id={key} class="border-gray-divider flex flex-col border-t first:border-0">
            <div
              class="not-prose border-gray-divider relative w-full border-b hover:bg-[#fafafa] dark:hover:bg-[#343434]"
            >
              <h3 class="text-gray-inverse text-sm font-medium">
                <button
                  id={`accordion-btn-${key}`}
                  class="h-full w-full py-2 px-2.5 text-left"
                  aria-controls={`accordion-${key}`}
                  aria-expanded={ariaBool(isOpen)}
                  on:click={() => {
                    _isOpen[key] = !_isOpen[key];
                    window.history.pushState({}, '', `#${key}`);
                  }}
                >
                  <code class="font-medium">{prop.name}</code>

                  {#if hasReadonly && prop.readonly}
                    <span
                      class="ml-1.5 rounded-md bg-gray-200 py-px px-2 font-mono text-xs dark:bg-gray-600"
                    >
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
              class={clsx(!isOpen && 'hidden', 'prose dark:prose-invert relative p-4 pb-0')}
            >
              {#if hasTypes}
                <div class="flex flex-col space-y-4 pt-2 font-mono text-sm">
                  {#each getInfo(category, prop) as [title, code] (title)}
                    <div>
                      <span class="text-gray-inverse">{title}:</span>
                      <code class="-ml-1 text-indigo-500 dark:text-indigo-300">
                        {code}
                      </code>
                    </div>
                  {/each}
                </div>
              {/if}

              {#if hasLink}
                <a class="absolute top-5 right-5 text-sm" href={prop.link} target="_blank">
                  {isMDNLink(prop.link) ? 'MDN' : 'Reference'}
                </a>
              {/if}

              <div class={clsx('pb-3 text-sm', hasTypes && 'mt-6')}>
                {@html prop.description}
              </div>
            </div>
          </div>
        {/each}
      </div>

      {#if filterHasDesc(api[category]).length > 3}
        <div class="text-gray-soft mt-4 flex items-center justify-end text-sm">
          <button
            class="hover:text-gray-inverse rounded-sm px-2.5 py-1 font-medium"
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

          {#if isAllOpen[category] || filterHasDesc(api[category]).length > 10}
            <button
              class="hover:text-gray-inverse rounded-sm px-2.5 py-1 font-medium"
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
