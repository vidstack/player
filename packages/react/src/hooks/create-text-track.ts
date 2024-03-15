import * as React from 'react';

import { TextTrack, type TextTrackInit } from 'vidstack';

import { useMediaContext } from './use-media-context';

/**
 * Creates a new `TextTrack` object and adds it to the player.
 *
 * @docs {@link https://www.vidstack.io/docs/player/api/hooks/create-text-track}
 */
export function createTextTrack(init: TextTrackInit) {
  const media = useMediaContext(),
    track = React.useMemo(() => new TextTrack(init), Object.values(init));

  React.useEffect(() => {
    media.textTracks.add(track);
    return () => void media.textTracks.remove(track);
  }, [track]);

  return track;
}
