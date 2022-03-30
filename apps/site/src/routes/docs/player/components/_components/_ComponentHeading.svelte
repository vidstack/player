<script lang="ts">
  import { elementHeading } from '$lib/stores/element';
  import { isApiPath, isReactPath } from '$lib/stores/path';
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
