<script lang="ts">
  import { frontmatter, markdown, route } from '@vitebook/svelte';

  import { getSidebarContext } from '$src/layouts/sidebar/context';
  import socialCardLarge from '$src/img/brand/social-card-large.jpg';
  import { jsLib, titleCaseJSLib } from '$src/stores/js-lib';
  import { elementHeading } from '$src/stores/element';
  import { isApiPath } from '$src/stores/path';

  const { activeCategory } = getSidebarContext();

  $: category = $activeCategory ? `${$activeCategory}: ` : '';
  $: lib = $jsLib !== 'html' ? ` (${titleCaseJSLib($jsLib)})` : '';

  $: mdTitle = $frontmatter?.title ?? $markdown?.title;

  $: elementTitle =
    $elementHeading.length > 0 ? `${$elementHeading}${$isApiPath ? ' API' : ''}` : null;

  $: title =
    mdTitle || elementTitle ? `${category}${mdTitle ?? elementTitle}${lib} | Vidstack` : null;

  $: description = $markdown?.frontmatter.description;
</script>

<svelte:head>
  <meta name="docsearch:version" content="latest" />

  {#key $jsLib}
    <meta name="docsearch:jslib" content={$jsLib} />
  {/key}

  {#key title}
    {#if title}
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta name="twitter:title" content={title} />
    {/if}
    {#if description}
      <meta name="description" content={description} />
      <meta name="twitter:description" content={description} />
      <meta name="og:description" content={description} />
    {/if}
    {#if title && description}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@vidstackjs" />
      <meta name="twitter:image" content={`https:vidstack.io${socialCardLarge}`} />
      <meta name="twitter:creator" content="@vidstackjs" />
      <meta property="og:site_name" content="Vidstack" />
      <meta property="og:url" content={`https:vidstack.io${$route.url.pathname}`} />
      <meta property="og:type" content="article" />
      <meta property="og:image" content={`https:vidstack.io${socialCardLarge}`} />
    {/if}
  {/key}
</svelte:head>
