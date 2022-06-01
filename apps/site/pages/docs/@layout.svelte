<script lang="ts" context="module">
  import { type ServerLoader } from '@vitebook/core';

  export const loader: ServerLoader = async () => {
    const { loadSidebar } = await import('$src/server/utils');
    return {
      data: { sidebar: await loadSidebar() },
      cache: () => true,
    };
  };
</script>

<script lang="ts">
  import { readable } from 'svelte/store';
  import { route } from '@vitebook/svelte';

  import DocsLayout from '$src/layouts/DocsLayout.svelte';
  import Algolia from '$src/components/algolia/Algolia.svelte';
  import { currentJSLibSidebar, getJSLibFromPath, jsLib } from '$src/stores/js-lib';
  import { installMethod, installMethods } from '$src/stores/install-method';
  import { mediaProvider, mediaProviders } from '$src/stores/media-provider';
  import { getSelectionFromPath } from '$src/utils/path';

  export let sidebar;

  const jsLibSidebar = currentJSLibSidebar(readable(sidebar));

  jsLib.set(getJSLibFromPath($route.url.pathname));
  installMethod.set(getSelectionFromPath(installMethods) ?? 'npm');
  mediaProvider.set(getSelectionFromPath(mediaProviders) ?? 'video');
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
