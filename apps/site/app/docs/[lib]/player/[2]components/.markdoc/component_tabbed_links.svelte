<script>
  import { comingSoonElement } from '$lib/stores/element';

  import { route } from '@vessel-js/svelte';

  import TabbedLink from '../../../../.markdoc/tabbed_link.svelte';
  import TabbedLinks from '../../../../.markdoc/tabbed_links.svelte';

  $: path = $route.matchedURL.pathname;
  $: docsHref = path.endsWith('/api') ? path.replace(/\/api$/, '') : path;
  $: apiHref = !path.includes('/api') ? path + '/api' : path;
</script>

<TabbedLinks>
  <TabbedLink title="Docs" href={docsHref} />
  <TabbedLink title="API" href={apiHref} disabled={$comingSoonElement} />
</TabbedLinks>
