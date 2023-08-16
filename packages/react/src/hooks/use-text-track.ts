import React from 'react';
import { useReactContext } from 'maverick.js/react';
import { mediaContext, TextTrack, type TextTrackInit } from 'vidstack/local';

/**
 * Creates a new `TextTrack` object and adds it to the player.
 *
 * @see {@link https://www.vidstack.io/docs/player/api/text-tracks}
 */
export function useTextTrack(init: TextTrackInit) {
  const media = useReactContext(mediaContext)!,
    track = React.useMemo(() => new TextTrack(init), Object.values(init));

  React.useEffect(() => {
    media.textTracks.add(track);
    return () => void media.textTracks.remove(track);
  }, [track]);

  return track;
}
