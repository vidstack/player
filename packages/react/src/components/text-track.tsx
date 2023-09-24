import type { TextTrackInit } from 'vidstack/local';

import { createTextTrack } from '../hooks/create-text-track';

export interface TrackProps extends TextTrackInit {
  readonly lang?: TextTrackInit['language'];
  readonly key?: string;
}

/**
 * Creates a new `TextTrack` object and adds it to the player.
 *
 * @see {@link https://www.vidstack.io/docs/player/api/text-tracks}
 */
function Track({ lang, ...props }: TrackProps) {
  createTextTrack({ language: lang, ...props });
  return null;
}

Track.displayName = 'Track';
export { Track };
