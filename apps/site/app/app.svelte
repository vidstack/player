<script>
  import '$lib/styles/fonts.css';
  import '$lib/styles/app.css';
  import '$lib/styles/tailwind.css';
  import '$lib/styles/docs.css';
  import '$lib/polyfills/focus-visible';

  import 'vidstack/styles/defaults.css';
  import 'vidstack/styles/community-skin/audio.css';
  import 'vidstack/styles/community-skin/video.css';

  import { useRouter } from '@vessel-js/svelte';
  import { RouteAnnouncer, RouterOutlet } from '@vessel-js/svelte';
  import { defineCustomElements } from 'vidstack/elements';
  import { onMount } from 'svelte';
  import { createComplexScrollDelegate } from '@vessel-js/app';

  const router = useRouter();

  onMount(() => {
    defineCustomElements();
    const scrollDelegate = createComplexScrollDelegate(router);
    // scrollDelegate.setBase(() => ({ top: 96 }));
    router.setScrollDelegate(scrollDelegate);
  });
</script>

<RouteAnnouncer />
<RouterOutlet />
