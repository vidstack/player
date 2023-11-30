// Register elements.
import '../src/elements/bundles/player.ts';
import '../src/elements/bundles/player-layouts.ts';
import '../src/elements/bundles/player-ui.ts';
import '../src/elements/bundles/icons.ts';

import { isHLSProvider, type TextTrackInit } from '../src';

const player = document.querySelector('media-player')!;

player.addEventListener('provider-change', (event) => {
  const provider = event.detail;
  // We can configure provider's here.
  if (isHLSProvider(provider)) {
    provider.config = {};
  }
});

// We can listen for the `can-play` event to be notified when the player is ready.
player.addEventListener('can-play', () => {
  // ...
});

// ***********************************************************************************************
// Source Management
// ***********************************************************************************************

const audioSrcButton = document.querySelector('#audio-src-button'),
  videoSrcButton = document.querySelector('#video-src-button'),
  hlsSrcButton = document.querySelector('#hls-src-button'),
  liveSrcButton = document.querySelector('#live-src-button'),
  youtubeSrcButton = document.querySelector('#youtube-src-button'),
  vimeoSrcButton = document.querySelector('#vimeo-src-button');

audioSrcButton?.addEventListener('click', () => changeSource('audio'));
videoSrcButton?.addEventListener('click', () => changeSource('video'));
hlsSrcButton?.addEventListener('click', () => changeSource('hls'));
liveSrcButton?.addEventListener('click', () => changeSource('live'));
youtubeSrcButton?.addEventListener('click', () => changeSource('youtube'));
vimeoSrcButton?.addEventListener('click', () => changeSource('vimeo'));

changeSource('audio');

function changeSource(type: string) {
  const muxPlaybackId = 'VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU';
  switch (type) {
    case 'audio':
      player.src = 'https://media-files.vidstack.io/sprite-fight/audio.mp3';
      break;
    case 'video':
      player.src = `https://stream.mux.com/${muxPlaybackId}/low.mp4`;
      break;
    case 'hls':
      player.src = `https://stream.mux.com/${muxPlaybackId}.m3u8`;
      break;
    case 'live':
      player.src = 'https://stream.mux.com/v69RSHhFelSm4701snP22dYz2jICy4E4FUyk02rW4gxRM.m3u8';
      break;
    case 'youtube':
      player.src = 'youtube/_cMxraX_5RE';
      break;
    case 'vimeo':
      player.src = 'vimeo/640499893';
      break;
  }
}

// ***********************************************************************************************
// Text Track Management
// ***********************************************************************************************

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
const tracks: TextTrackInit[] = [
  // Subtitles
  {
    src: 'https://media-files.vidstack.io/sprite-fight/subs/english.vtt',
    label: 'English',
    language: 'en-US',
    kind: 'subtitles',
    default: true,
  },
  {
    src: 'https://media-files.vidstack.io/sprite-fight/subs/spanish.vtt',
    label: 'Spanish',
    language: 'es-ES',
    kind: 'subtitles',
  },
  // Chapters
  {
    src: 'https://media-files.vidstack.io/sprite-fight/chapters.vtt',
    kind: 'chapters',
    language: 'en-US',
    default: true,
  },
];

for (const track of tracks) {
  player.textTracks.add(track);
}
