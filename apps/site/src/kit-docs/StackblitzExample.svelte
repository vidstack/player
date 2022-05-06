<script lang="ts">
  import { dev } from '$app/env';
  import { page } from '$app/stores';
  import { framework } from '$lib/stores/framework';

  import { isDarkColorScheme } from '@svelteness/kit-docs';
  import { uppercaseFirstLetter } from '@vidstack/foundation';

  import Stackblitz from './Stackblitz.svelte';

  export let name: string;
  export let title = `${uppercaseFirstLetter(name.replace(/-/g, ' '))} example`;

  function getExt(framework) {
    switch (framework) {
      case 'html':
        return '.html';
      case 'react':
        return '.tsx';
    }
  }

  $: project = `github/vidstack/vidstack/tree/main/apps/site/examples`;
  $: ext = getExt($framework);
  $: path = $page.url.pathname.replace(/^\/?docs\//, '').replace('/react', '');
  $: theme = `theme=${!$isDarkColorScheme ? 'light' : 'dark'}`;
  $: initialPath = `/${path}/${name}_${ext.replace(/^\./, '')}?${theme}`;
  $: markupFile = `/${path}/${name}${ext}`;
  $: cssFile = `/${path}/${name}.css`;
  $: files = [markupFile, cssFile];
  $: src = dev ? `http://localhost:4001${initialPath}` : null;
</script>

<Stackblitz
  {src}
  {title}
  {project}
  {initialPath}
  file={files}
  view="preview"
  hideNavigation
  hideDevTools
  hideExplorer
  clickToLoad
/>
