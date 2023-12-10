import * as React from 'react';

import { createDisposalBin, listenEvent } from 'maverick.js/std';
import type { VTTCue } from 'media-captions';
import type { TextTrack } from 'vidstack';

/**
 * @docs {@link https://www.vidstack.io/docs/player/api/hooks/use-text-cues}
 */
export function useTextCues(track: TextTrack | null): VTTCue[] {
  const [cues, setCues] = React.useState<VTTCue[]>([]);

  React.useEffect(() => {
    if (!track) return;

    function onCuesChange(track: TextTrack) {
      setCues([...track.cues]);
    }

    const disposal = createDisposalBin();
    disposal.add(
      listenEvent(track, 'add-cue', () => onCuesChange(track)),
      listenEvent(track, 'remove-cue', () => onCuesChange(track)),
    );

    onCuesChange(track);

    return () => {
      disposal.empty();
      setCues([]);
    };
  }, [track]);

  return cues;
}
