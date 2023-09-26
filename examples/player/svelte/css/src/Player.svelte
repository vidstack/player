<script lang="ts">
  // Import styles.
  import 'vidstack/player/styles/base.css';
  import './buttons.css';
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
  class="player"
  title="Sprite Fight"
  src="https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/low.mp4"
  crossorigin
  on:provider-change={onProviderChange}
  on:can-play={onCanPlay}
  bind:this={player}
>
  <media-provider>
    <media-poster
      class="poster"
      src="https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/thumbnail.webp?time=268&width=1200"
      alt="Girl walks into campfire with gnomes surrounding her friend ready for their next meal!"
    />
  </media-provider>

  <VideoLayout />
</media-player>

<style lang="postcss">
  .player {
    --media-brand: #f5f5f5;
    --media-focus-ring-color: #4e9cf6;
    --media-focus-ring: 0 0 0 3px var(--media-focus-ring-color);

    --media-tooltip-y-offset: 30px;
    --media-menu-y-offset: 30px;

    width: 100%;
    aspect-ratio: 16 /9;
    background-color: #212121;
    border-radius: var(--media-border-radius);
    color: #f5f5f5;
    contain: layout;
    font-family: sans-serif;
    overflow: hidden;

    &[data-focus]:not([data-playing]) {
      box-shadow: var(--media-focus-ring);
    }
  }

  .player :global(video),
  .poster {
    border-radius: var(--media-border-radius);
  }

  .poster {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    width: 100%;
    height: 100%;

    &[data-visible] {
      opacity: 1;
    }
  }

  .poster :global(img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
