<script>
  import '$lib/styles/fonts.css';
  import '$lib/styles/app.css';
  import '$lib/styles/tailwind.css';
  import '$lib/styles/docs.css';
  import '$lib/polyfills/focus-visible';

  import 'vidstack/define/skins';

  import 'vidstack/styles/themes/default.css';
  import 'vidstack/styles/skins/default/audio.css';
  import 'vidstack/styles/skins/default/video.css';

  import { useRouter } from '@vessel-js/svelte';
  import { RouteAnnouncer, RouterOutlet } from '@vessel-js/svelte';
  import { onMount } from 'svelte';
  import { createComplexScrollDelegate } from '@vessel-js/app';

  const router = useRouter();

  onMount(() => {
    const scrollDelegate = createComplexScrollDelegate(router);
    // scrollDelegate.setBase(() => ({ top: 96 }));
    router.setScrollDelegate(scrollDelegate);
  });
</script>

<RouteAnnouncer />
<RouterOutlet />
