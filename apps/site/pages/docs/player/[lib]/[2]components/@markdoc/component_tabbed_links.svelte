<script>
  import { comingSoonElement, elementTagName } from '$src/stores/element';

  import { route } from '@vitebook/svelte';

  import TabbedLink from '../../../../@markdoc/tabbed_link.svelte';
  import TabbedLinks from '../../../../@markdoc/tabbed_links.svelte';

  $: path = $route.url.pathname;
  $: docsHref = path.endsWith('/api.html') ? path.replace(/\/api\.html$/, '/') : path;
  $: apiHref = !path.includes('/api.html') ? `${path.replace(/\/$/, '')}/api.html` : path;

  /* remove Import code snippets from buffering indicator and controls page */
  const invalidElements = new Set(['vds-buffering-indicator', 'vds-controls']);
  $: hideSnippets = invalidElements.has($elementTagName);
</script>

<TabbedLinks>
  <TabbedLink title="Docs" href={docsHref} />
  {#if !hideSnippets}
    <TabbedLink title="API" href={apiHref} disabled={$comingSoonElement} />
  {/if}
</TabbedLinks>
