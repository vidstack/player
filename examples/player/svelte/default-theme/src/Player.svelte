<script lang="ts">
  // Import styles.
  import 'vidstack/player/styles/default/theme.css';
  // Register elements.
  import 'vidstack/player';
  import 'vidstack/player/ui';
  import 'vidstack/icons';

  import { onMount } from 'svelte';
  import {
    isHLSProvider,
    type MediaCanPlayEvent,
    type MediaProviderSetupEvent,
    type MediaViewType,
  } from 'vidstack';
  import type { MediaPlayerElement } from 'vidstack/elements';

  import AudioLayout from './components/layouts/AudioLayout.svelte';
  import VideoLayout from './components/layouts/VideoLayout.svelte';
  import { textTracks } from './tracks';

  let player: MediaPlayerElement,
    src = '',
    viewType: MediaViewType = 'unknown';

  // Initialize src.
  changeSource('audio');

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
    return player.subscribe((state) => {
      viewType = state.viewType;
    });
  });

  function onProviderSetup(event: MediaProviderSetupEvent) {
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

  function changeSource(type: string) {
    const muxPlaybackId = 'VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU';
    switch (type) {
      case 'audio':
        src = 'https://media-files.vidstack.io/sprite-fight/audio.mp3';
        break;
      case 'video':
        src = `https://stream.mux.com/${muxPlaybackId}/low.mp4`;
        break;
      case 'hls':
        src = `https://stream.mux.com/${muxPlaybackId}.m3u8`;
        break;
    }
  }
</script>

<media-player
  class="player"
  title="Sprite Fight"
  {src}
  crossorigin
  on:provider-setup={onProviderSetup}
  on:can-play={onCanPlay}
  bind:this={player}
>
  <media-provider>
    {#if viewType === 'video'}
      <media-poster
        class="vds-poster"
        src="https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/thumbnail.webp?time=268&width=1200"
        alt="Girl walks into campfire with gnomes surrounding her friend ready for their next meal!"
      />
    {/if}
  </media-provider>
  <!-- Layouts -->
  {#if viewType === 'audio'}
    <AudioLayout />
  {:else if viewType === 'video'}
    <VideoLayout
      thumbnails="https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/storyboard.vtt"
    />
  {/if}
</media-player>

<div class="src-buttons">
  <button on:click={() => changeSource('audio')}>Audio</button>
  <button on:click={() => changeSource('video')}>Video</button>
  <button on:click={() => changeSource('hls')}>HLS</button>
</div>

<style lang="postcss">
  .player {
    --media-brand: #f5f5f5;
    --media-focus-ring-color: #4e9cf6;
    --media-focus-ring: 0 0 0 3px var(--media-focus-ring-color);
    width: 100%;

    &[data-view-type='audio'] {
      --media-tooltip-y-offset: 44px;
      --media-menu-y-offset: 40px;
      --media-slider-chapter-title-color: black;
      --media-border-radius: 4px;
      background-color: #212121;
      border-radius: var(--media-border-radius);
      contain: layout;
    }

    &[data-view-type='video'] {
      --media-tooltip-y-offset: 30px;
      --media-menu-y-offset: 30px;
      width: 100%;
      aspect-ratio: 16 /9;
      background-color: #212121;
      border-radius: var(--media-border-radius);
      contain: layout;
    }

    & :global(video),
    media-poster {
      border-radius: var(--media-border-radius);
    }
  }

  .src-buttons {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    margin-top: 40px;
    margin-inline: auto;
    max-width: 300px;
  }
</style>
