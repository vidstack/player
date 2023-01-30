<script>
  import { elementTagName } from '$lib/stores/element';

  import { route } from '@vessel-js/svelte';

  import TabbedLink from '../../../../.markdoc/tabbed_link.svelte';
  import TabbedLinks from '../../../../.markdoc/tabbed_links.svelte';

  $: path = $route.matchedURL.pathname;
  $: docsHref = path.endsWith('/api') ? path.replace(/\/api$/, '') : path;
  $: apiHref = !path.includes('/api') ? path + '/api' : path;

  /* remove API Tab for these elements */
  const elements = new Set([
    'media-buffering-indicator',
    'media-controls',
    'media-live-indicator',
    'media-pip-button',
    'media-captions-button',
  ]);

  $: hideAPI = elements.has($elementTagName);
</script>

<TabbedLinks>
  <TabbedLink title="Docs" href={docsHref} />
  {#if !hideAPI}
    <TabbedLink title="API" href={apiHref} />
  {/if}
</TabbedLinks>
