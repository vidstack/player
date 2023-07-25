<script>
  import '$lib/styles/fonts.css';
  import '$lib/styles/app.css';
  import '$lib/styles/tailwind.css';
  import '$lib/styles/docs.css';
  import '$lib/polyfills/focus-visible';
  import 'vidstack/player/skins';
  import 'vidstack/styles/player/themes/default.css';
  import 'vidstack/styles/player/skins/default/audio.css';
  import 'vidstack/styles/player/skins/default/video.css';
  import { createComplexScrollDelegate } from '@vessel-js/app';
  import { RouteAnnouncer, RouterOutlet, useRouter } from '@vessel-js/svelte';
  import { onMount } from 'svelte';

  const router = useRouter();

  onMount(() => {
    const scrollDelegate = createComplexScrollDelegate(router);
    // scrollDelegate.setBase(() => ({ top: 96 }));
    router.setScrollDelegate(scrollDelegate);
  });
</script>

<RouteAnnouncer />
<RouterOutlet />
