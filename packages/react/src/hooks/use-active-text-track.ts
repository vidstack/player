import * as React from 'react';

import { useReactContext } from 'maverick.js/react';
import { mediaContext, observeActiveTextTrack, type TextTrack } from 'vidstack';

/**
 * @docs {@link https://www.vidstack.io/docs/player/api/hooks/use-active-text-track}
 */
export function useActiveTextTrack(kind: TextTrackKind | TextTrackKind[]): TextTrack | null {
  const media = useReactContext(mediaContext)!,
    [track, setTrack] = React.useState<TextTrack | null>(null);

  React.useEffect(() => {
    return observeActiveTextTrack(media.textTracks, kind, setTrack);
  }, [kind]);

  return track;
}
