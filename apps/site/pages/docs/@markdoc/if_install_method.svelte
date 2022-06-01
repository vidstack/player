<script lang="ts">
  import { installMethod, type InstallMethodType } from '$src/stores/install-method';

  export let is: InstallMethodType | `!${InstallMethodType}`;
</script>

{#if is.startsWith('!') ? is.slice(1) !== $installMethod : is === $installMethod}
  <slot />
{/if}
