import type { CaptionsFileFormat, CaptionsParserFactory } from 'media-captions';

import { createTextTrack } from '../hooks/create-text-track';

/**
 * Creates a new `TextTrack` object and adds it to the player.
 *
 * @see {@link https://www.vidstack.io/docs/player/api/text-tracks}
 * @example
 * ```tsx
 * <MediaPlayer>
 *   <MediaProvider>
 *     <Track
 *       src="english.vtt"
 *       kind="subtitles"
 *       label="English"
 *       lang="en-US"
 *       default
 *     />
 *   </MediaProvider>
 * </MediaPlayer>
 * ```
 */
function Track({ lang, ...props }: TrackProps) {
  createTextTrack({ language: lang, ...props });
  return null;
}

export interface TrackProps {
  /**
   * A unique identifier.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/TextTrack/id}
   */
  readonly id?: string;
  /**
   * URL of the text track resource. This attribute must be specified and its URL value must have
   * the same origin as the document — unless the <audio> or <video> parent element of the track
   * element has a `crossorigin` attribute.
   */
  readonly src?: string;
  /**
   * Used to directly pass in text track file contents.
   */
  readonly content?: string;
  /**
   * The captions file format to be parsed or a custom parser factory (functions that returns a
   * captions parser). Supported types include: 'vtt', 'srt', 'ssa', 'ass', and 'json'.
   *
   * @defaultValue 'vtt'
   */
  readonly type?: 'json' | CaptionsFileFormat | CaptionsParserFactory;
  /**
   * The text encoding type to be used when decoding data bytes to text.
   *
   * @defaultValue 'utf-8'
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Encoding_API/Encodings}
   *
   */
  readonly encoding?: string;
  /**
   * Indicates that the track should be enabled unless the user's preferences indicate that
   * another track is more appropriate. This may only be used on one track element per media
   * element.
   *
   * @defaultValue false
   */
  readonly default?: boolean;
  /**
   * The kind of text track this object represents. This decides how the track will be handled
   * by the player.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/TextTrack/kind}
   */
  readonly kind: TextTrackKind;
  /**
   * A human-readable label for the text track. This will be displayed to the user.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/TextTrack/label}
   */
  readonly label?: string;
  /**
   * A string containing a language identifier. For example, `"en-US"` for United States English
   * or `"pt-BR"` for Brazilian Portuguese.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/TextTrack/language}
   * @see {@link https://datatracker.ietf.org/doc/html/rfc5646}
   */
  readonly language?: string;
  /**
   * A string containing a language identifier. For example, `"en-US"` for United States English
   * or `"pt-BR"` for Brazilian Portuguese. This is a short alias for `language`.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/TextTrack/language}
   * @see {@link https://datatracker.ietf.org/doc/html/rfc5646}
   */
  readonly lang?: TrackProps['language'];
  /**
   * React list key.
   */
  readonly key?: string;
}

Track.displayName = 'Track';
export { Track };
