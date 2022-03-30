<script lang="ts">
  import { elementTagName } from '$lib/stores/element';
  import { isReactPath } from '$lib/stores/path';

  import { getSidebarContext } from '$lib/layout/Sidebar.svelte';

  export let hash: string | null = null;

  const { activeCategory } = getSidebarContext();

  $: categorySegment = $activeCategory.toLowerCase();
  $: base = `/docs/player/components/${categorySegment}`;
  $: componentSegment = $elementTagName.replace('vds-', '');
  $: frameworkSegment = $isReactPath ? '/react' : '';
  $: apiUrl = `${base}/${componentSegment}${frameworkSegment}/api${hash ? `#${hash}` : ''}`;
</script>

<a href={apiUrl}><slot /></a>
