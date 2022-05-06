<script lang="ts">
  import { dev } from '$app/env';
  import { page } from '$app/stores';
  import { lib } from '$lib/stores/lib';

  import { isDarkColorScheme } from '@svelteness/kit-docs';
  import { uppercaseFirstLetter } from '@vidstack/foundation';

  import Stackblitz from './Stackblitz.svelte';

  export let name: string;
  export let css = false;
  export let title = `${uppercaseFirstLetter(name.replace(/-/g, ' '))} example`;

  function getExt(lib) {
    switch (lib) {
      case 'html':
        return '.html';
      case 'react':
        return '.tsx';
    }
  }

  $: project = `github/vidstack/vidstack/tree/main/apps/site/examples`;
  $: ext = getExt($lib);
  $: path = $page.url.pathname.replace(/^\/?docs\//, '').replace('/react', '');
  $: theme = `theme=${!$isDarkColorScheme ? 'light' : 'dark'}`;
  $: initialPath = `/${path}/${name}_${ext.replace(/^\./, '')}?${theme}`;
  $: markupFile = `/src/${path}/${name}${ext}`;
  $: cssFile = css || path.includes('/components/ui') ? `/src/${path}/${name}.css` : null;
  $: files = [markupFile, cssFile].filter(Boolean);
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
