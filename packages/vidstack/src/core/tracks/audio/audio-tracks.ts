import { SelectList, type SelectListItem } from '../../../foundation/list/select-list';
import type { AudioTrackListEvents } from './events';

/**
 * @see {@link https://vidstack.io/docs/player/api/audio-tracks}
 */
export class AudioTrackList extends SelectList<AudioTrack, AudioTrackListEvents> {}

/**
 * @see {@link https://vidstack.io/docs/player/api/audio-tracks}
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
