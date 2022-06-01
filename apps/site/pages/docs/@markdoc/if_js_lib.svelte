<script lang="ts">
  import { jsLib, type JSLibType } from '$src/stores/js-lib';

  export let is: JSLibType | `!${JSLibType}`;
</script>

{#if is.startsWith('!') ? is.slice(1) !== $jsLib : is === $jsLib}
  <slot />
{/if}
