<script>
  import '$lib/styles/fonts.css';
  import '$lib/styles/tailwind.css';
  import '$lib/styles/app.css';
  import '$lib/polyfills/focus-visible';
  import './__layout.css';

  import NProgress from 'nprogress';

  import { onMount } from 'svelte';
  import { navigating } from '$app/stores';

  onMount(() => {
    // Strange fix for strange issue -_O_- (`cmd + k` opening two docsearch containers).
    window.addEventListener('keydown', (e) => {
      if (e.key === 'k' && e.metaKey) {
        setTimeout(() => {
          const search = Array.from(document.querySelectorAll('.DocSearch.DocSearch-Container'));
          search[1]?.remove();
        });
      }
    });
  });

  // https://github.com/rstacruz/nprogress#configuration
  NProgress.configure({ minimum: 0.16 });
  $: NProgress[$navigating ? 'start' : 'done']();
</script>

<slot />
