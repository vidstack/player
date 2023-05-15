<script lang="ts" context="module">
  interface Data {
    api: ComponentApi;
  }

  export const staticLoader: StaticLoader<never, Data> = async ({ url }) => {
    const { loadComponentAPI } = await import('$lib/server/component-api');
    return { data: { api: await loadComponentAPI(url.pathname) } };
  };
</script>

<script lang="ts">
  import type { StaticLoader } from '@vessel-js/app/server';
  import { frontmatter, markdown, matches, useStaticData } from '@vessel-js/svelte';

  import ApiTable from '$lib/components/docs/ApiTable.svelte';
  import { getOnThisPageContext } from '$lib/layouts/toc/context';
  import type { ComponentApi } from '$lib/server/component-api';
  import { elementHeading } from '$lib/stores/element';
  import { isApiPath } from '$lib/stores/path';
  import { camelToTitleCase } from '$lib/utils/string';

  const data = useStaticData(staticLoader),
    toc = getOnThisPageContext();

  $: {
    const match = $matches.find((match) => match.id === '/docs/[lib]/player/components');
    if (match?.layout) match.layout.stale = true;
  }

  $: apiCategories = Object.keys($data?.api || {}).filter((key) => $data.api[key]);

  $: {
    toc.override.set(null);
    if (apiCategories.length) {
      toc.override.set([
        ...($markdown?.headings || []),
        { title: 'Component API', id: 'component_api', level: 2 },
        ...apiCategories.map((category) => ({
          title: camelToTitleCase(category).replace('Css', 'CSS'),
          id: `api_${category.toLowerCase()}`,
          level: 3,
        })),
      ]);
    }
  }
</script>

<h1 class="flex flex-row">
  {$elementHeading}
  {#if $isApiPath}
    <span class="inline-block opacity-0">API</span>
  {/if}
</h1>

{#if $frontmatter.description}
  <p class="-mt-4">
    {@html $frontmatter.description}
  </p>
{/if}

<slot />

{#if apiCategories.length}
  <h2 id="component_api">
    <a class="header-anchor" href="#component_api" aria-hidden="true">#</a>
    Component API
  </h2>
{/if}

{#key $data}
  {#if apiCategories.length}
    <ApiTable api={$data.api} />
  {/if}
{/key}
