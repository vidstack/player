<script lang="ts">
  import { elementTagName } from '$lib/stores/element';
  import { isReactPath } from '$lib/stores/path';

  import { getSidebarContext } from '@svelteness/kit-docs';

  export let hash: string | null = null;

  const { activeCategory } = getSidebarContext();

  $: categorySegment = $activeCategory.toLowerCase();
  $: base = `/docs/player/components/${categorySegment}`;
  $: componentSegment = $elementTagName.replace('vds-', '');
  $: libSegment = $isReactPath ? '/react' : '';
  $: apiUrl = `${base}/${componentSegment}${libSegment}/api${hash ? `#${hash}` : ''}`;
</script>

<a href={apiUrl}><slot /></a>
