<script lang="ts">
  import { elementHeading } from '$src/stores/element';
  import { currentJSLibTitle, jsLib } from '$src/stores/js-lib';
  import { isApiPath } from '$src/stores/path';
</script>

<h1 class="flex flex-row">
  {$elementHeading}
  {#if $isApiPath}
    <span class="inline-block opacity-0">API</span>
  {/if}
  {#if $jsLib !== 'html'}
    <span class="inline-block opacity-0">
      ({$currentJSLibTitle})
    </span>
  {/if}
</h1>
