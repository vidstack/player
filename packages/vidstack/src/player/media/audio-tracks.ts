import {
  List,
  ListAddEvent,
  ListChangeEvent,
  ListEvents,
  ListItem,
  ListRemoveEvent,
} from '../../foundation/list/list';
import { LIST_ITEMS } from '../../foundation/list/symbols';

/**
 * @see {@link https://vidstack.io/docs/player/core-concepts/audio-tracks}
 */
export class AudioTrackList extends List<AudioTrack> {
  getTrackById(id: string): AudioTrack | null {
    return this[LIST_ITEMS].find((track) => track.id === id) ?? null;
  }
}

/**
 * @see {@link https://vidstack.io/docs/player/core-concepts/audio-tracks}
 */
export interface AudioTrack extends ListItem {
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

export interface AudioTrackListEvents extends ListEvents<AudioTrack> {
  add: AddAudioTrackEvent;
  remove: RemoveAudioTrackEvent;
  change: ChangeAudioTrackEvent;
}

export interface AddAudioTrackEvent extends ListAddEvent<AudioTrack> {}
export interface RemoveAudioTrackEvent extends ListRemoveEvent<AudioTrack> {}
export interface ChangeAudioTrackEvent extends ListChangeEvent<AudioTrack> {}
