<script lang="ts" context="module">
  interface Data {
    api: ComponentApi;
  }

  export const staticLoader: StaticLoader<never, Data> = async ({ pathname }) => {
    const { loadComponentAPI } = await import('$lib/server/component-api');
    return { data: { api: await loadComponentAPI(pathname) } };
  };
</script>

<script lang="ts">
  import type { StaticLoader } from '@vessel-js/app/server';
  import { useStaticData } from '@vessel-js/svelte';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';

  import ApiTable from '$lib/components/docs/ApiTable.svelte';
  import { getOnThisPageContext } from '$lib/layouts/toc/context';
  import type { ComponentApi } from '$lib/server/component-api';
  import { camelToTitleCase } from '$lib/utils/string';

  const toc = getOnThisPageContext(),
    data = useStaticData(staticLoader);

  onMount(() => {
    toc.fallback.set(
      Object.keys(get(data).api).map((header) => ({
        id: header,
        level: 2,
        title: camelToTitleCase(header).replace('Css', 'CSS'),
      })),
    );

    return () => toc.fallback.set(null);
  });
</script>

<ApiTable api={$data.api} />

<slot />
