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
  import '$styles/fonts.css';
  import '$styles/tailwind.css';
  import '$styles/app.css';
  import '$polyfills/focus-visible';

  import MainLayout from '$layout/MainLayout.svelte';
  import { createSidebarContext, type SidebarNav } from '$layout/Sidebar.svelte';
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
