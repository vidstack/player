<script lang="ts">
  import { useRouter } from '@vessel-js/svelte';
  import InfoIcon from '~icons/ri/information-line';
  import QuestionIcon from '~icons/ri/question-fill';

  import type { ComponentApi } from '$lib/server/component-api';
  import { jsLib } from '$lib/stores/js-lib';
  import { isKeyboardClick } from '$lib/utils/keyboard';
  import { camelToTitleCase, kebabToPascalCase } from '$lib/utils/string';

  import Popover from '../base/Popover.svelte';

  export let api: ComponentApi;

  const router = useRouter();

  const categories = Object.keys(api); // ['props', 'events', 'slots', ...]

  const readonlyRE = /props|instanceProps|cssVars/;
  const descRE = /slots|cssParts/;
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

  function propToKey(category: string, propName: string) {
    return `${category.toLowerCase()}_${propName.toLowerCase()}`;
  }

  function jsxEventName(eventName: string) {
    return `on${kebabToPascalCase(eventName)}`;
  }
</script>

{#each categories as category (category)}
  {@const id = `api_${category.toLowerCase()}`}
  {@const categoryTitle = camelToTitleCase(category).replace('Css', 'CSS')}
  {@const hasTypes = !noTypes.has(category)}
  {@const hasReadonly = readonlyRE.test(category)}
  {@const hasDescription = descRE.test(category)}
  <div class="mt-12 mb-6 flex flex-col justify-center">
    <div class="flex items-center">
      <h3 {id} class="m-0">
        <a class="header-anchor" href={`#${id}`} aria-hidden="true">#</a>
        {categoryTitle}
      </h3>
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
  </div>
  <div class="relative api-table my-[2em] overflow-visible">
    <table class="overflow-visible min-w-full">
      <thead>
        <tr>
          <th>Name</th>
          {#if hasDescription}
            <th>Description</th>
          {/if}
          {#if hasTypes}
            <th>Type</th>
          {/if}
        </tr>
      </thead>
      <tbody>
        {#each api[category] || [] as prop (prop)}
          {@const name =
            category === 'events' && $jsLib === 'react'
              ? jsxEventName(prop.name)
              : (category === 'cssVars' ? '--' : '') + prop.name}
          {@const key = propToKey(category, name)}
          {@const hasLink = 'link' in prop}
          {@const hasAttr =
            category === 'props' && $jsLib !== 'react' && prop.attr && !prop.readonly}
          {@const hasDetail = category === 'events' && prop.detail}
          {@const info = [
            [hasTypes && 'Type', prop.type],
            [hasAttr && 'Attribute', prop.attr],
            [category === 'props' && 'Default', prop.default],
            [hasDetail && 'Detail', prop.detail],
          ].filter((i) => i[0])}
          <tr class="even:bg-elevate">
            <td>
              <div class="flex items-center">
                {#if (prop.docs || hasAttr || hasDetail) && !hasDescription}
                  <Popover lockScrollbar={false} side="right">
                    <svelte:fragment slot="button">
                      <div class="sr-only">{`${name} info`}</div>
                      <InfoIcon
                        class="text-black/60 dark:text-white/60 group-hover:text-black dark:group-hover:text-white"
                        width={16}
                        height={16}
                      />
                    </svelte:fragment>
                    <div class="flex flex-col">
                      <h1 class="inline-block text-xl mb-0 font-semibold">
                        {name}
                      </h1>

                      {#if prop.docs}
                        <div class="text-sm whitespace-normal max-w-[500px] overflow-y-auto">
                          {@html prop.docs}
                        </div>
                      {/if}

                      {#each info as [title, value]}
                        <div class="mt-2">
                          <span class="text-sm font-medium block">{title}</span>
                          <code class="inline-block text-xs mt-2 py-0.5 whitespace-pre-wrap">
                            {value}
                          </code>
                        </div>
                      {/each}

                      {#if hasLink}
                        <div class="flex px-2 mt-2">
                          <div class="flex-1" />
                          <a class="text-sm" href={prop.link} target="_blank" rel="noreferrer">
                            {isMDNLink(prop.link) ? 'MDN' : 'Reference'}
                          </a>
                        </div>
                      {/if}
                    </div>
                  </Popover>
                {/if}
                <code
                  class="text-xs font-normal cursor-pointer text-inverse dark:text-inverse -ml-1"
                  on:pointerup={(e) => {
                    router.go(`#${key}`, { replace: true });
                  }}
                  on:keydown={(e) => {
                    isKeyboardClick(e) && router.go(`#${key}`, { replace: true });
                  }}
                >
                  <h4 class="inline my-0 text-inherit -mr-1" id={key} style="font-size: inherit;">
                    {name}
                  </h4>
                </code>
              </div>
            </td>

            {#if hasDescription}
              <td class="w-full whitespace-normal">{@html prop.docs}</td>
            {/if}

            {#if hasTypes}
              <td>
                {#if hasReadonly && prop.readonly}
                  <code>readonly</code>
                {/if}
                <code>{prop.type}</code>
              </td>
            {/if}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/each}
