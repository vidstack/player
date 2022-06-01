<script>
  import { frontmatter } from '@vitebook/svelte';
</script>

{#if $frontmatter?.description}
  <p class="-mt-4">
    {@html $frontmatter.description}
  </p>
{/if}
