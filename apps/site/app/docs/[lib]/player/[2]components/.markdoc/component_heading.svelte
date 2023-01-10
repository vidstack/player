<script lang="ts">
  import { elementHeading } from '$lib/stores/element';
  import { isApiPath } from '$lib/stores/path';
</script>

<h1 class="flex flex-row">
  {$elementHeading}
  {#if $isApiPath}
    <span class="inline-block opacity-0">API</span>
  {/if}
</h1>
