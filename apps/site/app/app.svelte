<script>
  import '$lib/styles/fonts.css';
  import '$lib/styles/app.css';
  import '$lib/styles/tailwind.css';
  import '$lib/polyfills/focus-visible';

  import 'vidstack/styles/base.css';
  import 'vidstack/styles/ui/buttons.css';
  import 'vidstack/styles/ui/sliders.css';

  import { useRouter } from '@vessel-js/svelte';
  import { RouteAnnouncer, RouterOutlet } from '@vessel-js/svelte';
  import { defineCustomElements } from 'vidstack/elements';
  import { onMount } from 'svelte';
  import { createComplexScrollDelegate } from '@vessel-js/app';

  const router = useRouter();

  onMount(() => {
    defineCustomElements();

    const scrollDelegate = createComplexScrollDelegate(router);

    scrollDelegate.setBase(() => {
      return {
        top: 96,
        behavior: 'smooth',
      };
    });

    if (router.url.hash) scrollDelegate.scroll({ hash: router.url.hash });
    router.setScrollDelegate(scrollDelegate);
  });
</script>

<RouteAnnouncer />
<RouterOutlet />
