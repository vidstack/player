<script context="module">
  import { get } from 'svelte/store';
  import { createSvelteViewRenderer } from '@vitebook/svelte';

  import { isLargeScreen } from '$src/stores/screen';

  /** @type {import('@vitebook/core').ConfigureApp} */
  export function configureApp({ router, renderers }) {
    renderers.push(createSvelteViewRenderer());

    router.scrollBase = () => {
      const noHash = !get(router.navigation)?.to.hash;
      return {
        top: noHash ? 0 : get(isLargeScreen) ? 96 : 192,
        behavior: 'smooth',
      };
    };
  }
</script>

<script>
  import '$src/styles/fonts.css';
  import '$src/styles/app.css';
  import '$src/styles/tailwind.css';
  import '$src/polyfills/focus-visible';

  import { PageLayouts, PageView } from '@vitebook/svelte';
</script>

<PageLayouts>
  <PageView />
</PageLayouts>
