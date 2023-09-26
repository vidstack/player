<script lang="ts">
  // Import styles.
  import 'vidstack/player/styles/base.css';
  // Register elements.
  import 'vidstack/player';
  import 'vidstack/player/ui';
  import 'vidstack/icons';

  import { onMount } from 'svelte';
  import { isHLSProvider, type MediaCanPlayEvent, type MediaProviderChangeEvent } from 'vidstack';
  import type { MediaPlayerElement } from 'vidstack/elements';

  import VideoLayout from './components/layouts/VideoLayout.svelte';
  import { textTracks } from './tracks';

  let player: MediaPlayerElement;

  onMount(() => {
    /**
     * You can add these tracks using HTML as well.
     *
     * @example
     * ```html
     * <media-provider>
     *   <track label="..." src="..." kind="..." srclang="..." default />
     *   <track label="..." src="..." kind="..." srclang="..." />
     * </media-provider>
     * ```
     */
    for (const track of textTracks) player.textTracks.add(track);

    // Subscribe to state updates.
    return player.subscribe(({ paused, viewType }) => {
      // console.log('is paused?', '->', paused);
      // console.log('is audio view?', '->', viewType === 'audio');
    });
  });

  function onProviderChange(event: MediaProviderChangeEvent) {
    const provider = event.detail;
    // We can configure provider's here.
    if (isHLSProvider(provider)) {
      provider.config = {};
    }
  }

  // We can listen for the `can-play` event to be notified when the player is ready.
  function onCanPlay(event: MediaCanPlayEvent) {
    // ...
  }
</script>

<media-player
  class="w-full aspect-video bg-slate-900 text-white font-sans overflow-hidden rounded-md ring-media-focus data-[focus]:ring-4"
  title="Sprite Fight"
  src="https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/low.mp4"
  crossorigin
  on:provider-change={onProviderChange}
  on:can-play={onCanPlay}
  bind:this={player}
>
  <media-provider>
    <media-poster
      class="absolute inset-0 block h-full w-full rounded-md opacity-0 transition-opacity data-[visible]:opacity-100 [&>img]:h-full [&>img]:w-full [&>img]:object-cover"
      src="https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/thumbnail.webp?time=268&width=1200"
      alt="Girl walks into campfire with gnomes surrounding her friend ready for their next meal!"
    />
  </media-provider>

  <VideoLayout
    thumbnails="https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/storyboard.vtt"
  />
</media-player>
