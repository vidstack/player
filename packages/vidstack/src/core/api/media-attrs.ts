import type { MediaState } from './player-state';

export const MEDIA_ATTRIBUTES = Symbol(__DEV__ ? 'MEDIA_ATTRIBUTES' : 0);

export const mediaAttributes: (keyof MediaState)[] = [
  'autoplay',
  'canFullscreen',
  'canPictureInPicture',
  'canLoad',
  'canPlay',
  'canSeek',
  'ended',
  'fullscreen',
  'loop',
  'live',
  'liveEdge',
  'mediaType',
  'muted',
  'paused',
  'pictureInPicture',
  'playing',
  'playsinline',
  'seeking',
  'started',
  'streamType',
  'viewType',
  'waiting',
];
