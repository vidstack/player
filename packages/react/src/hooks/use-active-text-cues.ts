import * as React from 'react';
import { listenEvent } from 'maverick.js/std';
import type { VTTCue } from 'media-captions';
import type { TextTrack } from 'vidstack/lib';

export function useActiveTextCues(track: TextTrack | null): VTTCue[] {
  const [activeCues, setActiveCues] = React.useState<VTTCue[]>([]);

  React.useEffect(() => {
    if (!track) {
      setActiveCues([]);
      return;
    }

    return listenEvent(track, 'cue-change', () => {
      setActiveCues(track.activeCues as VTTCue[]);
    });
  }, [track]);

  return activeCues;
}
