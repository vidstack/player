import * as React from 'react';

import { EventsController } from 'maverick.js/std';
import type { VTTCue } from 'media-captions';
import type { TextTrack } from 'vidstack';

/**
 * @docs {@link https://www.vidstack.io/docs/player/api/hooks/use-text-cues}
 */
export function useTextCues(track: TextTrack | null): VTTCue[] {
  const [cues, setCues] = React.useState<VTTCue[]>([]);

  React.useEffect(() => {
    if (!track) return;

    function onCuesChange() {
      if (track) setCues([...track.cues]);
    }

    const events = new EventsController(track)
      .add('add-cue', onCuesChange)
      .add('remove-cue', onCuesChange);

    onCuesChange();

    return () => {
      setCues([]);
      events.abort();
    };
  }, [track]);

  return cues;
}
