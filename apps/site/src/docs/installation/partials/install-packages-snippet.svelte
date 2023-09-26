<script lang="ts">
  import NPMInstallSnippet from '~/components/code-snippet/npm-install-snippet.svelte';

  import { selections } from '../selection/selection-stores';

  const { js, provider } = selections;

  $: packages = [
    $js === 'react' ? '@vidstack/react@next' : 'vidstack@next',
    $provider === 'hls' && 'hls.js',
  ].filter(Boolean) as string[];
</script>

<NPMInstallSnippet {packages} />
