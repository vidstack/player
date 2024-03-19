import { getScope, onDispose, scoped, type Dispose } from 'maverick.js';
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

export function watchActiveTextTrack(
  tracks: TextTrackList,
  kind: TextTrackKind | TextTrackKind[],
  onChange: (track: TextTrack | null) => void,
): Dispose {
  let currentTrack: TextTrack | null = null,
    scope = getScope();

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
      scoped(() => {
        const off = listenEvent(
          track,
          'load',
          () => {
            onChange(track);
            off();
          },
          { once: true },
        );
      }, scope);
    }

    currentTrack = track;
  }

  onModeChange();
  return listenEvent(tracks, 'mode-change', onModeChange);
}

export function watchCueTextChange(
  tracks: TextTrackList,
  kind: TextTrackKind | TextTrackKind[],
  callback: (title: string) => void,
) {
  watchActiveTextTrack(tracks, kind, (track) => {
    if (!track) {
      callback('');
      return;
    }

    const onCueChange = () => {
      const activeCue = track?.activeCues[0];
      callback(activeCue?.text || '');
    };

    onCueChange();
    listenEvent(track, 'cue-change', onCueChange);
  });
}
