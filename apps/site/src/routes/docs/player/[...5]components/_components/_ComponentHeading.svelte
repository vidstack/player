<script lang="ts">
  import { elementHeading } from '$lib/stores/element';
  import { isApiPath, isReactPath } from '$lib/stores/path';
  import { kitDocs } from '@svelteness/kit-docs';
</script>

<h1 class="flex flex-row">
  {$elementHeading}
  {#if $isApiPath}
    <span class="inline-block opacity-0">API</span>
  {/if}
  {#if $isReactPath}
    <span class="inline-block opacity-0">(React)</span>
  {/if}
</h1>

{#if $kitDocs.meta?.description}
  <p class="-mt-4">
    {@html $kitDocs.meta?.description}
  </p>
{/if}
