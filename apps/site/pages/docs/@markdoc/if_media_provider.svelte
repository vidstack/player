<script lang="ts">
  import { mediaProvider, type MediaProviderType } from '$src/stores/media-provider';

  export let is: MediaProviderType | `!${MediaProviderType}`;
</script>

{#if is.startsWith('!') ? is.slice(1) !== $mediaProvider : is === $mediaProvider}
  <slot />
{/if}
