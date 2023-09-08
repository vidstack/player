import type { TextTrackInit } from 'vidstack/local';

import { createTextTrack } from '../hooks/create-text-track';

export interface TextTrackProps extends TextTrackInit {
  readonly lang?: TextTrackInit['language'];
}

/**
 * Creates a new `TextTrack` object and adds it to the player.
 *
 * @see {@link https://www.vidstack.io/docs/player/api/text-tracks}
 */
function TextTrack({ lang, ...props }: TextTrackProps) {
  createTextTrack({ language: lang, ...props });
  return null;
}

TextTrack.displayName = 'TextTrack';
export { TextTrack };
