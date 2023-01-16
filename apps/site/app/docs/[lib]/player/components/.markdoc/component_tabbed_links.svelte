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
    'vds-buffering-indicator',
    'vds-controls',
    'vds-youtube',
    'vds-vimeo',
    'vds-captions',
    'vds-live-indicator',
  ]);

  $: hideAPI = elements.has($elementTagName);
</script>

<TabbedLinks>
  <TabbedLink title="Docs" href={docsHref} />
  {#if !hideAPI}
    <TabbedLink title="API" href={apiHref} />
  {/if}
</TabbedLinks>
