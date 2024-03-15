import type { DOMEvent } from 'maverick.js/std';

import type { ListReadonlyChangeEvent } from '../..//foundation/list/list';
import { SelectList, type SelectListItem } from '../../foundation/list/select-list';

/**
 * @see {@link https://vidstack.io/docs/player/core-concepts/audio-tracks}
 */
export class AudioTrackList extends SelectList<AudioTrack, AudioTrackListEvents> {
  getById(id: string): AudioTrack | null {
    if (id === '') return null;
    return this._items.find((track) => track.id === id) ?? null;
  }

  indexOf(track: AudioTrack) {
    return this._items.indexOf(track);
  }
}

/**
 * @see {@link https://vidstack.io/docs/player/core-concepts/audio-tracks}
 */
export interface AudioTrack extends SelectListItem {
  /**
   * A string which uniquely identifies the track within the media.
   */
  readonly id: string;
  /**
   * A human-readable label for the track, or an empty string if unknown.
   */
  readonly label: string;
  /**
   * A string specifying the audio track's primary language, or an empty string if unknown. The
   * language is specified as a BCP 47 (RFC 5646) language code, such as "en-US" or "pt-BR".
   */
  readonly language: string;
  /**
   * A string specifying the category into which the track falls. For example, the main audio
   * track would have a kind of "main".
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/AudioTrack/kind}
   */
  readonly kind: string;
}

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
