<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit';

  export const prerender = true;

  export const load: Load = () => {
    return {
      status: 307,
      redirect: '/docs/player/getting-started/releases/',
    };
  };
</script>
