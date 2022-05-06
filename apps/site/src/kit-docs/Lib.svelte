<script>
  import { lib } from '$lib/stores/lib';
</script>

{#if $lib === 'html'}
  <slot name="html" />
{:else if $lib === 'react'}
  <slot name="react" />
{/if}
