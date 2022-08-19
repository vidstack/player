<script lang="ts">
  import { frontmatter, markdown } from '@vitebook/svelte';

  import { getSidebarContext } from '$src/layouts/sidebar/context';
  import { jsLib, titleCaseJSLib } from '$src/stores/js-lib';
  import { elementHeading } from '$src/stores/element';
  import { isApiPath } from '$src/stores/path';
  import MetaTags from '../base/MetaTags.svelte';

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

  <MetaTags {title} {description} />
</svelte:head>
