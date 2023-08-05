import * as React from 'react';
import { useReactContext } from 'maverick.js/react';
import { mediaContext, observeActiveTextTrack, type TextTrack } from 'vidstack/lib';

export function useActiveTextTrack(kind: TextTrackKind | TextTrackKind[]): TextTrack | null {
  const media = useReactContext(mediaContext)!,
    [track, setTrack] = React.useState<TextTrack | null>(null);

  React.useEffect(() => {
    return observeActiveTextTrack(media.textTracks, kind, setTrack);
  }, [kind]);

  return track;
}
