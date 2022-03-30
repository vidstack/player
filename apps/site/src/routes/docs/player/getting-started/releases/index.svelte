<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit';

  export const prerender = true;

  export const load: Load = async () => {
    const res = await fetch(`/docs/player/getting-started/releases/latest.json`);
    const { slug } = await res.json();

    return {
      status: 307,
      redirect: `/docs/player/getting-started/releases/${slug}/`,
    };
  };
</script>
