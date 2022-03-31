<script lang="ts" context="module">
  import type { Load } from '@sveltejs/kit';

  export const load: Load = async ({ url, fetch }) => {
    const res = await fetch(`/docs/meta/${url.pathname.replace(/\//g, '%2f')}.json`);
    const { meta } = await res.json();

    return {
      props: {
        meta,
      },
    };
  };
</script>

<script lang="ts">
  import '$lib/styles/markdown.css';

  import { page } from '$app/stores';
  import socialCardLarge from '$lib/img/brand/social-card-large.jpg';
  import { markdownMeta, type MarkdownMeta } from '$lib/stores/markdown';

  export let meta: MarkdownMeta;

  $: markdownMeta.set(meta);
</script>

<svelte:head>
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@vidstackjs" />
  <meta name="twitter:image" content={`https://vidstack.io${socialCardLarge}`} />
  <meta name="twitter:creator" content="@vidstackjs" />
  <meta property="og:url" content={`https://vidstack.io${$page.url.pathname}`} />
  <meta property="og:type" content="article" />
  <meta property="og:image" content={`https://vidstack.io${socialCardLarge}`} />
</svelte:head>

<slot />
