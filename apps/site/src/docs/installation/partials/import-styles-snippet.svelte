<script lang="ts">
  import CodeSnippet from '~/components/code-snippet/code-snippet.svelte';

  import { selections } from '../selection/selection-stores';

  const { js, css, provider } = selections;

  $: basePath = `docs/player/getting-started/installation/styles${
    $js === 'cdn' ? '/cdn' : $js === 'react' ? '/react' : ''
  }`;

  $: styleId =
    $css === 'css' || $css === 'tailwind-css'
      ? 'base'
      : $css === 'default-layout'
      ? `default-layout-${$provider === 'hls' ? 'video' : $provider}`
      : 'default-theme';

  $: id = `${basePath}/import-${styleId}`;

  $: title = $js === 'cdn' ? 'html' : 'js';
</script>

<CodeSnippet {id} {title} copy />
