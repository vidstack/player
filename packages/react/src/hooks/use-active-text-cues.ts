import * as React from 'react';

import { listenEvent } from 'maverick.js/std';
import type { VTTCue } from 'media-captions';
import type { TextTrack } from 'vidstack';

/**
 * @docs {@link https://www.vidstack.io/docs/player/api/hooks/use-active-text-cues}
 */
export function useActiveTextCues(track: TextTrack | null): VTTCue[] {
  const [activeCues, setActiveCues] = React.useState<VTTCue[]>([]);

  React.useEffect(() => {
    if (!track) {
      setActiveCues([]);
      return;
    }

    function onCuesChange() {
      if (track) setActiveCues(track.activeCues as VTTCue[]);
    }

    onCuesChange();
    return listenEvent(track, 'cue-change', onCuesChange);
  }, [track]);

  return activeCues;
}
