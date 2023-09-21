// Import styles.
import 'vidstack/player/styles/default/theme.css';
import 'vidstack/player/styles/default/layouts/audio.css';
import 'vidstack/player/styles/default/layouts/video.css';
import './player.css';
// Register elements.
import 'vidstack/player';
import 'vidstack/player/layouts';
import 'vidstack/player/ui';

import { createSignal, onCleanup, onMount } from 'solid-js';
import { isHLSProvider, type MediaCanPlayEvent, type MediaProviderSetupEvent } from 'vidstack';
import type { MediaPlayerElement } from 'vidstack/elements';

import { textTracks } from './tracks';

export function Player() {
  let player!: MediaPlayerElement,
    [src, setSrc] = createSignal('');

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

    onCleanup(
      // Subscribe to state updates.
      player.subscribe(({ paused, viewType }) => {
        // console.log('is paused?', '->', paused);
        // console.log('is audio view?', '->', viewType === 'audio');
      }),
    );
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
        setSrc('https://media-files.vidstack.io/sprite-fight/audio.mp3');
        break;
      case 'video':
        setSrc(`https://stream.mux.com/${muxPlaybackId}/low.mp4`);
        break;
      case 'hls':
        setSrc(`https://stream.mux.com/${muxPlaybackId}.m3u8`);
        break;
    }
  }

  return (
    <>
      <media-player
        class="player"
        title="Sprite Fight"
        src={src()}
        crossorigin
        on:provider-setup={onProviderSetup}
        on:can-play={onCanPlay}
        ref={player}
      >
        <media-provider>
          <media-poster
            class="vds-poster"
            src="https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/thumbnail.webp?time=268&width=1200"
            alt="Girl walks into campfire with gnomes surrounding her friend ready for their next meal!"
          />
        </media-provider>
        {/* Layouts */}
        <media-audio-layout />
        <media-video-layout thumbnails="https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/storyboard.vtt" />
      </media-player>

      <div class="src-buttons">
        <button onClick={() => changeSource('audio')}>Audio</button>
        <button onClick={() => changeSource('video')}>Video</button>
        <button onClick={() => changeSource('hls')}>HLS</button>
      </div>
    </>
  );
}
