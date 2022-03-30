<script>
  import TabbedLinks from '$lib/components/markdown/TabbedLinks.svelte';
  import { page } from '$app/stores';

  $: path = $page.url.pathname;
  $: docsHref = path.includes('/api') ? path.replace(/\/api\/?/, '') : path;
  $: apiHref = !path.includes('/api') ? `${path.replace(/\/$/, '')}/api` : path;

  $: links = [
    { title: 'Docs', href: docsHref },
    { title: 'API', href: apiHref },
  ];
</script>

<TabbedLinks {links} />
