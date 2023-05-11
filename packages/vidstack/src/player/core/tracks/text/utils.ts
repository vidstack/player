import type { VTTCue } from 'media-captions';

import type { TextTrack } from './text-track';
import type { TextTrackList } from './text-tracks';

export function findActiveCue(time: number, cues: readonly VTTCue[]): VTTCue | null {
  for (let i = 0, len = cues.length; i < len; i++) {
    if (isCueActive(cues[i], time)) return cues[i];
  }

  return null;
}

export function isCueActive(cue: VTTCue, time: number) {
  return time >= cue.startTime && time < cue.endTime;
}

export function onTrackChapterChange(
  tracks: TextTrackList,
  currentTrack: TextTrack | null | undefined,
  onChange: (track: TextTrack | null) => void,
) {
  const track = tracks
    .toArray()
    .find((track) => track.kind === 'chapters' && track.mode === 'showing');

  if (track === currentTrack) return;

  if (!track) {
    onChange(null);
    return;
  }

  if (track.readyState == 2) {
    onChange(track);
  } else {
    onChange(null);
    track.addEventListener('load', () => onChange(track), { once: true });
  }
}
