import * as React from 'react';

import {
  isHLSProvider,
  MediaPlayer,
  MediaProvider,
  Poster,
  Track,
  type MediaCanPlayDetail,
  type MediaCanPlayEvent,
  type MediaPlayerInstance,
  type MediaProviderAdapter,
  type MediaProviderChangeEvent,
} from '../src';
import {
  DefaultAudioLayout,
  defaultLayoutIcons,
  DefaultVideoLayout,
} from '../src/components/layouts/default';
import { PlyrLayout, plyrLayoutIcons } from '../src/components/layouts/plyr';
import { textTracks } from './tracks';

export function Player() {
  let player = React.useRef<MediaPlayerInstance>(null),
    [src, setSrc] = React.useState('');

  React.useEffect(() => {
    // Initialize src.
    changeSource('audio');

    // Subscribe to state updates.
    return player.current!.subscribe(({ paused, viewType }) => {
      // console.log('is paused?', '->', paused);
      // console.log('is audio view?', '->', viewType === 'audio');
    });
  }, []);

  function onProviderChange(
    provider: MediaProviderAdapter | null,
    nativeEvent: MediaProviderChangeEvent,
  ) {
    // We can configure provider's here.
    if (isHLSProvider(provider)) {
      provider.config = {};
    }
  }

  // We can listen for the `can-play` event to be notified when the player is ready.
  function onCanPlay(detail: MediaCanPlayDetail, nativeEvent: MediaCanPlayEvent) {
    // ...
  }

  function changeSource(type: string) {
    switch (type) {
      case 'audio':
        setSrc('https://files.vidstack.io/sprite-fight/audio.mp3');
        break;
      case 'video':
        setSrc('https://files.vidstack.io/sprite-fight/480p.mp4');
        break;
      case 'hls':
        setSrc('https://files.vidstack.io/sprite-fight/hls/stream.m3u8');
        break;
      case 'dash':
        setSrc('https://files.vidstack.io/sprite-fight/dash/stream.mpd');
        break;
      case 'live':
        setSrc('https://stream.mux.com/v69RSHhFelSm4701snP22dYz2jICy4E4FUyk02rW4gxRM.m3u8');
        break;
      case 'youtube':
        setSrc('youtube/_cMxraX_5RE');
        break;
      case 'vimeo':
        setSrc('vimeo/640499893');
        break;
    }
  }

  return (
    <>
      <MediaPlayer
        className="player"
        title="Sprite Fight"
        src={src}
        crossOrigin
        playsInline
        onProviderChange={onProviderChange}
        onCanPlay={onCanPlay}
        ref={player}
      >
        <MediaProvider>
          <Poster
            className="vds-poster"
            src="https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/thumbnail.webp?time=268&width=1200"
            alt="Girl walks into campfire with gnomes surrounding her friend ready for their next meal!"
          />
          {textTracks.map((track) => (
            <Track {...track} key={track.src} />
          ))}
        </MediaProvider>

        {/* Layouts */}
        <DefaultAudioLayout icons={defaultLayoutIcons} />
        <DefaultVideoLayout
          icons={defaultLayoutIcons}
          thumbnails="https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/storyboard.vtt"
        />
      </MediaPlayer>

      <div className="src-buttons">
        <button onClick={() => changeSource('audio')}>Audio</button>
        <button onClick={() => changeSource('video')}>Video</button>
        <button onClick={() => changeSource('hls')}>HLS</button>
        <button onClick={() => changeSource('dash')}>DASH</button>
        <button onClick={() => changeSource('live')}>Live</button>
        <button onClick={() => changeSource('youtube')}>YouTube</button>
        <button onClick={() => changeSource('vimeo')}>Vimeo</button>
      </div>
    </>
  );
}
