<script lang="ts">
  import '$styles/markdown.css';

  import { page } from '$app/stores';
  import socialCardLarge from '$img/brand/social-card-large.jpg';
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
