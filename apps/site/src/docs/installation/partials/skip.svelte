<script lang="ts">
  import { selections } from '../selection/selection-stores';

  const { css } = selections;
</script>

{#if $css === 'default-layout'}
  <p>You can skip this step since you're using the Default Layout.</p>
{:else}
  <slot />
{/if}
