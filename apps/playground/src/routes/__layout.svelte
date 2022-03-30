<script lang="ts" context="module">
  import type { Load } from '@sveltejs/kit';

  export const load: Load = async ({ fetch }) => {
    const res = await fetch(`/sidebar.json`);
    const { sidebar } = (await res.json()) as { sidebar: SidebarNav };
    return {
      props: {
        sidebar,
      },
    };
  };
</script>

<script lang="ts">
  import '$lib/styles/fonts.css';
  import '$lib/styles/tailwind.css';
  import '$lib/styles/app.css';
  import '$lib/polyfills/focus-visible';

  import MainLayout from '$lib/layout/MainLayout.svelte';
  import { createSidebarContext, type SidebarNav } from '$lib/layout/Sidebar.svelte';
  import { readable } from 'svelte/store';

  export let sidebar;

  const { activeCategory, activeComponent, activeVariant } = createSidebarContext(
    readable(sidebar),
  );
</script>

<svelte:head>
  <title>{$activeCategory}: {$activeComponent} - {$activeVariant.title} | Vidstack</title>
</svelte:head>

<MainLayout>
  <slot />
</MainLayout>
