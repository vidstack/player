<script>
  import { isElementExperimental } from '$lib/stores/element';
  import ExperimentalCallout from '../../../../.markdoc/experimental_callout.svelte';
</script>

{#if $isElementExperimental}
  <ExperimentalCallout />
{/if}
