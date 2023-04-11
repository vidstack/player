import { onDispose } from 'maverick.js';

import {
  TEXT_TRACK_NATIVE,
  TEXT_TRACK_NATIVE_HLS,
  TEXT_TRACK_READY_STATE,
} from '../../tracks/text/symbols';
import { TextTrack as VdsTextTrack } from '../../tracks/text/text-track';
import type { MediaSetupContext } from '../types';

/**
 * This is used to discover text tracks that were found by the native playback engine. For example,
 * Safari will load text tracks that were embedded in the HLS playlist.
 */
export function discoverNativeHLSTextTracks(video: HTMLVideoElement, context: MediaSetupContext) {
  video.textTracks.onaddtrack = (event: TrackEvent) => {
    const nativeTrack = event.track;

    // Skip tracks the `NativeTextRenderer` has added.
    if (!nativeTrack || findTextTrackElement(video, nativeTrack)) return;

    const track = new VdsTextTrack({
      id: nativeTrack.id,
      kind: nativeTrack.kind,
      label: nativeTrack.label,
      language: nativeTrack.language,
      type: 'vtt',
    });

    track[TEXT_TRACK_NATIVE] = { track: nativeTrack };
    track[TEXT_TRACK_READY_STATE] = 2;
    track[TEXT_TRACK_NATIVE_HLS] = true;

    let lastIndex = 0;
    const onCueChange = (event: Event) => {
      if (!nativeTrack.cues) return;
      for (let i = lastIndex; i < nativeTrack.cues.length; i++) {
        track.addCue(nativeTrack.cues[i] as VTTCue, event);
        lastIndex++;
      }
    };

    onCueChange(event);
    nativeTrack.oncuechange = onCueChange;

    context.textTracks.add(track, event);
    track.setMode(nativeTrack.mode, event);
  };

  onDispose(() => {
    video.textTracks.onaddtrack = null;
    for (const track of context.textTracks) {
      const nativeTrack = track[TEXT_TRACK_NATIVE]?.track as TextTrack | undefined;
      if (nativeTrack?.oncuechange) nativeTrack.oncuechange = null;
    }
  });
}

function findTextTrackElement(video: HTMLVideoElement, track) {
  return Array.from(video.children).find((el) => (el as HTMLTrackElement).track === track);
}
