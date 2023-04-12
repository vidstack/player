import { effect, type ReadSignal } from 'maverick.js';

import type { MediaContext } from '../context';
import { TextTrack, type TextTrackInit } from '../tracks/text/text-track';

export function useTextTracks(
  $domTracks: ReadSignal<TextTrackInit[]>,
  { textTracks, $$props }: MediaContext,
) {
  const { $textTracks } = $$props;

  let prevTextTracks: (TextTrack | TextTrackInit)[] = [];

  effect(() => {
    const newTracks = [...$textTracks(), ...$domTracks()];

    for (const newTrack of newTracks) {
      const id = newTrack.id || TextTrack.createId(newTrack);
      if (!textTracks.getById(id)) {
        // @ts-expect-error - override readonly
        newTrack.id = id;
        textTracks.add(newTrack);
      }
    }

    for (const oldTrack of prevTextTracks) {
      if (!newTracks.some((t) => t.id === oldTrack.id)) {
        const track = oldTrack.id && textTracks.getById(oldTrack.id);
        if (track) textTracks.remove(track);
      }
    }

    prevTextTracks = newTracks;
  });
}
