import '@vidstack/react/player/styles/default/theme.css';

import { useEffect, useRef, useState } from 'react';

import styles from './player.module.css';

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
  type MediaProviderSetupEvent,
  type MediaViewType,
} from '@vidstack/react';

import { AudioLayout } from './layouts/audio-layout';
import { VideoLayout } from './layouts/video-layout';
import { textTracks } from './tracks';

export function Player() {
  let player = useRef<MediaPlayerInstance>(null),
    [src, setSrc] = useState(''),
    [viewType, setViewType] = useState<MediaViewType>('unknown');

  useEffect(() => {
    // Initialize src.
    changeSource('audio');

    // Subscribe to state updates.
    return player.current!.subscribe(({ paused, viewType }) => {
      // console.log('is paused?', '->', paused);
      setViewType(viewType);
    });
  }, []);

  function onProviderSetup(provider: MediaProviderAdapter, nativeEvent: MediaProviderSetupEvent) {
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
      <MediaPlayer
        className={`${styles.player} media-player`}
        title="Sprite Fight"
        src={src}
        crossorigin
        onProviderSetup={onProviderSetup}
        onCanPlay={onCanPlay}
        ref={player}
      >
        <MediaProvider>
          {viewType === 'video' && (
            <Poster
              className={`${styles.poster} vds-poster`}
              src="https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/thumbnail.webp?time=268&width=1200"
              alt="Girl walks into campfire with gnomes surrounding her friend ready for their next meal!"
            />
          )}
          {textTracks.map((track) => (
            <Track {...track} key={track.src} />
          ))}
        </MediaProvider>

        {/* Layouts */}
        {viewType === 'audio' ? (
          <AudioLayout />
        ) : viewType === 'video' ? (
          <VideoLayout thumbnails="https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/storyboard.vtt" />
        ) : null}
      </MediaPlayer>

      <div className={styles.srcButtons}>
        <button onClick={() => changeSource('audio')}>Audio</button>
        <button onClick={() => changeSource('video')}>Video</button>
        <button onClick={() => changeSource('hls')}>HLS</button>
      </div>
    </>
  );
}
