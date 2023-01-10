<script>
  import { frontmatter, route } from '@vessel-js/svelte';

  let description, matchedPathname;

  $: {
    const newDescription = $frontmatter.description,
      newPath = $route.matchedURL.pathname.replace('/api', '');
    if (description !== newDescription && newPath !== matchedPathname) {
      description = newDescription;
      matchedPathname = newPath;
    }
  }
</script>

{#if description}
  <p class="-mt-4">
    {@html description}
  </p>
{/if}
