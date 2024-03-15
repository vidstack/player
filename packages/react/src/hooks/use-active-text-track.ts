import * as React from 'react';

import { watchActiveTextTrack, type TextTrack } from 'vidstack';

import { useMediaContext } from './use-media-context';

/**
 * @docs {@link https://www.vidstack.io/docs/player/api/hooks/use-active-text-track}
 */
export function useActiveTextTrack(kind: TextTrackKind | TextTrackKind[]): TextTrack | null {
  const media = useMediaContext(),
    [track, setTrack] = React.useState<TextTrack | null>(null);

  React.useEffect(() => {
    return watchActiveTextTrack(media.textTracks, kind, setTrack);
  }, [kind]);

  return track;
}
