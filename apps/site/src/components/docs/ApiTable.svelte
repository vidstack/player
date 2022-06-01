<script lang="ts">
  import clsx from 'clsx';
  import { tick } from 'svelte';

  import QuestionIcon from '~icons/ri/question-fill';
  import ArrowDropDownIcon from '~icons/ri/arrow-drop-down-fill';

  import { route } from '@vitebook/svelte';
  import { env } from '$src/env';
  import {
    ariaBool,
    camelToKebabCase,
    camelToTitleCase,
    kebabToPascalCase,
  } from '@vidstack/foundation';
  import { jsLib } from '$src/stores/js-lib';
  import type { ComponentApi } from '$src/server/component-api';

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

  function jsxEventName(eventName: string) {
    return `on${kebabToPascalCase(eventName.replace('vds-', ''))}`;
  }

  function getInfo(category: string, prop: any) {
    return [
      category === 'properties' &&
        prop.hasAttr &&
        !prop.readonly &&
        $jsLib !== 'react' && ['Attribute', prop.attr ?? camelToKebabCase(prop.name)],
      [category === 'methods' ? 'Signature' : 'Type', prop.type],
      category === 'events' && ['Detail', prop.detail],
      category === 'events' && ['JSX', jsxEventName(prop.name)],
    ].filter(Boolean);
  }

  function onHashChange() {
    if (!$route.url.hash) return;

    const hash = $route.url.hash;
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

  $: if (env.browser && $route.url.hash) {
    tick().then(onHashChange);
  }
</script>

{#each categories as category (category)}
  {@const showAll = _showAll[category]}
  {@const hasTypes = !noTypes.has(category)}
  {@const hasReadonly = category === 'properties'}

  {#if filterHasDesc(api[category]).length > 0}
    <div>
      <div class="flex mt-[2em] mb-[0.666em] items-center">
        <h2 id={category} class="m-0">
          <a class="header-anchor" href={`#${category}`} aria-hidden="true">#</a>
          {camelToTitleCase(category).replace('Css', 'CSS')}
        </h2>
        {#if categoryLinks[category]}
          <a
            href={categoryLinks[category]}
            target="_blank"
            class="flex h-full border-0 px-2.5 text-gray-300 items-center hover:text-gray-inverse"
          >
            <span class="sr-only">Learn more about {category}</span>
            <QuestionIcon width="24" height="24" />
          </a>
        {/if}
      </div>

      <div
        id={`scroll-${category}`}
        class={clsx(
          'border-gray-outline relative flex flex-col border scrollbar scroll-contain overflow-auto mt-[2em]',
          !showAll && 'max-h-[390px]',
        )}
      >
        {#each filterHasDesc(api[category]) as prop (prop)}
          {@const key = propToKey(category, prop.name)}
          {@const isOpen = _isOpen[key]}
          {@const hasLink = 'link' in prop}

          <div id={key} class="border-gray-outline border-t flex flex-col first:border-0">
            <div
              class="border-gray-outline border-b w-full not-prose relative hover:bg-[#fafafa] dark:hover:bg-[#343434]"
            >
              <h3 class="font-medium text-gray-inverse text-sm">
                <button
                  id={`accordion-btn-${key}`}
                  class="h-full text-left w-full py-2 px-2.5"
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
                      class="rounded-md font-mono bg-gray-200 py-px text-xs ml-1.5 px-2 dark:bg-gray-600"
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
                <div class="flex flex-col font-mono space-y-4 text-sm pt-2">
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
                <a class="text-sm top-5 right-5 absolute" href={prop.link} target="_blank">
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
        <div class="flex mt-4 text-gray-soft text-sm items-center justify-end">
          <button
            class="rounded-sm font-medium py-1 px-2.5 hover:text-gray-inverse"
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
              class="rounded-sm font-medium py-1 px-2.5 hover:text-gray-inverse"
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
