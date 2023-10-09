import * as React from 'react';

import { useReactContext } from 'maverick.js/react';
import { mediaContext, TextTrack, type TextTrackInit } from 'vidstack';

/**
 * Creates a new `TextTrack` object and adds it to the player.
 *
 * @docs {@link https://www.vidstack.io/docs/player/api/hooks/create-text-track}
 */
export function createTextTrack(init: TextTrackInit) {
  const media = useReactContext(mediaContext)!,
    track = React.useMemo(() => new TextTrack(init), Object.values(init));

  React.useEffect(() => {
    media.textTracks.add(track);
    return () => void media.textTracks.remove(track);
  }, [track]);

  return track;
}
