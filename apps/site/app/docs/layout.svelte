<script lang="ts" context="module">
  import { loadPlayerSidebar } from '$lib/server/load-sidebar';

  export async function staticLoader() {
    return {
      data: { sidebar: loadPlayerSidebar() },
      cache: () => true,
    };
  }
</script>

<script lang="ts">
  import { route, useStaticData } from '@vessel-js/svelte';
  import { readable } from 'svelte/store';

  import Algolia from '$lib/components/algolia/Algolia.svelte';
  import DocsLayout from '$lib/layouts/DocsLayout.svelte';
  import { installMethod, installMethods } from '$lib/stores/install-method';
  import { currentJSLibSidebar, getJSLibFromPath, jsLib } from '$lib/stores/js-lib';
  import { mediaProvider, mediaProviders } from '$lib/stores/media-provider';
  import { getSelectionFromPath } from '$lib/utils/path';

  const data = useStaticData(staticLoader);
  const jsLibSidebar = currentJSLibSidebar(readable($data.sidebar));

  jsLib.set(getJSLibFromPath($route.matchedURL.pathname));
  installMethod.set(getSelectionFromPath(installMethods) ?? 'npm');
  mediaProvider.set(getSelectionFromPath(mediaProviders) ?? 'video');

  route.subscribe(($route) => jsLib.set(getJSLibFromPath($route.matchedURL.pathname)));
</script>

<DocsLayout sidebar={jsLibSidebar}>
  <Algolia
    apiKey="03b81ed3b7849b33599967cec76734fe"
    appId="JV3QY1UI79"
    indexName="vidstack"
    slot="search"
  />

  <slot />
</DocsLayout>
