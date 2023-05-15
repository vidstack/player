<script>
  import { elementTagName } from '$lib/stores/element';

  import { route } from '@vessel-js/svelte';

  import TabbedLink from '../../../../.markdoc/tabbed_link.svelte';
  import TabbedLinks from '../../../../.markdoc/tabbed_links.svelte';

  $: path = $route.matchedURL.pathname;
  $: docsHref = path.endsWith('/api') ? path.replace(/\/api$/, '') : path;
  $: apiHref = !path.includes('/api') ? path + '/api' : path;

  /* remove API Tab for these elements */
  const elements = new Set(
    [
      'buffering-indicator',
      'controls',
      'live-indicator',
      'pip-button',
      'captions-button',
      'captions',
      'audio-menu',
      'captions-menu',
      'quality-menu',
      'playback-rate-menu',
    ].map((el) => `media-${el}`),
  );

  $: hideAPI = elements.has($elementTagName);
</script>

{#if !hideAPI}
  <TabbedLinks>
    <TabbedLink title="Docs" href={docsHref} />
    <TabbedLink title="API" href={apiHref} />
  </TabbedLinks>
{/if}
