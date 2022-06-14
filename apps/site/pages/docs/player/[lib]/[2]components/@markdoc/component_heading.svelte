<script lang="ts">
  import { elementHeading } from '$src/stores/element';
  import { isApiPath } from '$src/stores/path';
</script>

<h1 class="flex flex-row">
  {$elementHeading}
  {#if $isApiPath}
    <span class="inline-block opacity-0">API</span>
  {/if}
</h1>
