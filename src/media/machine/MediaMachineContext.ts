import type { MediaContext } from '../MediaContext';
import { MediaType } from '../MediaType';
import { createTimeRanges } from '../time-ranges';
import { ViewType } from '../ViewType';

export type MediaMachineContext = MediaContext;

export const mediaMachineContext: MediaMachineContext = {
  autoplay: false,
  autoplayError: undefined,
  buffered: createTimeRanges(),
  duration: NaN,
  bufferedAmount: 0,
  canRequestFullscreen: false,
  canPlay: false,
  canPlayThrough: false,
  controls: false,
  currentPoster: '',
  currentSrc: '',
  currentTime: 0,
  ended: false,
  error: undefined,
  fullscreen: false,
  loop: false,
  mediaType: MediaType.Unknown,
  muted: false,
  paused: true,
  played: createTimeRanges(),
  playing: false,
  playsinline: false,
  seekable: createTimeRanges(),
  seekableAmount: 0,
  seeking: false,
  started: false,
  viewType: ViewType.Unknown,
  volume: 1,
  waiting: false
};
