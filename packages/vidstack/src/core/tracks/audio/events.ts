import type { DOMEvent } from 'maverick.js/std';

import type { ListReadonlyChangeEvent } from '../../../foundation/list/list';
import type { AudioTrack, AudioTrackList } from './audio-tracks';

export interface AudioTrackListEvents {
  add: AudioTrackAddEvent;
  remove: AudioTrackRemoveEvent;
  change: AudioTrackChangeEvent;
  'readonly-change': ListReadonlyChangeEvent;
}

export interface AudioTrackListEvent<T> extends DOMEvent<T> {
  target: AudioTrackList;
}

/**
 * Fired when an audio track has been added to the list.
 *
 * @detail newTrack
 */
export interface AudioTrackAddEvent extends AudioTrackListEvent<AudioTrack> {}

/**
 * Fired when an audio track has been removed from the list.
 *
 * @detail removedTrack
 */
export interface AudioTrackRemoveEvent extends AudioTrackListEvent<AudioTrack> {}

/**
 * Fired when the selected audio track has changed.
 *
 * @detail change
 */
export interface AudioTrackChangeEvent extends AudioTrackListEvent<ChangeAudioTrackEventDetail> {}

export interface ChangeAudioTrackEventDetail {
  prev: AudioTrack | null;
  current: AudioTrack;
}
