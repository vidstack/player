import type { Dispose } from 'maverick.js';
import { isString, listenEvent } from 'maverick.js/std';
import type { VTTCue } from 'media-captions';

import type { TextTrack } from './text-track';
import type { TextTrackList } from './text-tracks';

export function findActiveCue(cues: readonly VTTCue[], time: number): VTTCue | null {
  for (let i = 0, len = cues.length; i < len; i++) {
    if (isCueActive(cues[i], time)) return cues[i];
  }

  return null;
}

export function isCueActive(cue: VTTCue, time: number) {
  return time >= cue.startTime && time < cue.endTime;
}

export function observeActiveTextTrack(
  tracks: TextTrackList,
  kind: TextTrackKind | TextTrackKind[],
  onChange: (track: TextTrack | null) => void,
): Dispose {
  let currentTrack: TextTrack | null = null;

  function onModeChange() {
    const kinds = isString(kind) ? [kind] : kind,
      track = tracks
        .toArray()
        .find((track) => kinds.includes(track.kind) && track.mode === 'showing');

    if (track === currentTrack) return;

    if (!track) {
      onChange(null);
      currentTrack = null;
      return;
    }

    if (track.readyState == 2) {
      onChange(track);
    } else {
      onChange(null);
      track.addEventListener('load', () => onChange(track), { once: true });
    }

    currentTrack = track;
  }

  onModeChange();
  return listenEvent(tracks, 'mode-change', onModeChange);
}
