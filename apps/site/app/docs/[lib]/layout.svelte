<script lang="ts" context="module">
  import { loadPlayerSidebar } from '$lib/server/load-sidebar';

  export async function staticLoader() {
    return {
      data: { sidebar: loadPlayerSidebar() },
      cache: ({ params }) => params.lib || '',
    };
  }
</script>

<script lang="ts">
  import { route, useStaticData } from '@vessel-js/svelte';
  import { readable } from 'svelte/store';

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
  <slot />
</DocsLayout>
