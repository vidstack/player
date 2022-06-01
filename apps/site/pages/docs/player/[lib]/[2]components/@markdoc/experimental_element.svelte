<script>
  import { isElementExperimental } from '$src/stores/element';
  import ExperimentalCallout from '../../../../@markdoc/experimental_callout.svelte';
</script>

{#if $isElementExperimental}
  <ExperimentalCallout />
{/if}
